import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import type { Types } from 'mongoose';
import { toChatMessage, type ChatMessageOut } from '../../graphql/mappers.js';
import { ChatMessage, type ChatMessageDoc } from '../../models/ChatMessage.js';
import type { TrackerDoc, TrackerRole } from '../../models/Tracker.js';
import { Transaction, type TransactionDoc } from '../../models/Transaction.js';
import type { UserDoc } from '../../models/User.js';
import { badInput, notFound } from '../../utils/errors.js';
import { formatMoney } from '../../utils/money.js';
import { startOfLocalDate } from '../../utils/time.js';
import { parseMessage, type ParsedReport } from '../ai.js';
import { buildReport, type Report, type ReportKind, type Stat } from '../reports/index.js';
import { loadTracker, scopeOf } from '../trackers/access.js';
import { loadCtx, option, parseContext, sameName, viewOnlyText, withIds, type Ctx } from './context.js';
import { advance, draftFromParsed, type Draft } from './draft.js';
import { applyOption } from './options.js';

/** Starter prompts shown in the empty chat and after help replies */
export const CHAT_SUGGESTIONS = [
  'Spent 250 on lunch',
  'Paid 1200 electricity bill via UPI',
  'Salary 50000 credited',
  'Spending by category this month',
  'Top spending last month',
  'Daily expense this week',
  'Average spend this month',
  'Income vs expense ratio',
];

const FOLLOW_UPS: { kind: ReportKind; label: string }[] = [
  { kind: 'CATEGORY', label: 'Spending by category' },
  { kind: 'DAILY', label: 'Daily spending this month' },
  { kind: 'TOP', label: 'Top spending' },
  { kind: 'AVERAGE', label: 'Average spending' },
  { kind: 'INCOME_VS_EXPENSE', label: 'Income vs expense' },
];

/** Whose conversation: one per user and tracker */
interface Thread {
  userId: Types.ObjectId;
  trackerId: Types.ObjectId;
}

const threadOf = (ctx: Ctx): Thread => ({ userId: ctx.user._id, trackerId: ctx.tracker._id });

type Kind = 'TEXT' | 'ERROR';
const say = (thread: Thread, text: string, kind: Kind = 'TEXT') => ChatMessage.create({ ...thread, role: 'ASSISTANT', kind, text });

function confirmation(ctx: Ctx, tx: TransactionDoc): string {
  const { locale, timezone } = ctx.user;
  const amount = formatMoney(tx.amount, tx.currency, locale);
  const converted = tx.currency === tx.baseCurrency ? '' : ` (≈ ${formatMoney(tx.amountBase, tx.baseCurrency, locale)})`;
  const what = [tx.categoryName, tx.expenseOnName].filter(Boolean).join(' · ');
  const when = format(new TZDate(tx.occurredAt.getTime(), timezone), 'd MMM');
  const source = tx.sourceName ?? '—';
  if (tx.type === 'INCOME') return `Added ${amount}${converted} income under ${what} — received in ${source} · ${when}`;
  return `Logged ${amount}${converted} for ${what} — paid via ${source} · ${when}`;
}

async function runDraft(ctx: Ctx, draft: Draft): Promise<ChatMessageDoc> {
  const thread = threadOf(ctx);
  try {
    const step = await advance(ctx, draft);
    if (step.kind === 'DONE') {
      return await ChatMessage.create({
        ...thread,
        role: 'ASSISTANT',
        kind: 'TRANSACTION',
        text: confirmation(ctx, step.tx),
        transactionId: step.tx._id,
        options: withIds([option('UNDO', 'Undo')]),
      });
    }
    if (step.kind === 'ASK') {
      return await ChatMessage.create({ ...thread, role: 'ASSISTANT', kind: 'OPTIONS', text: step.text, options: step.options, draft });
    }
    return await say(thread, step.text);
  } catch (err) {
    return say(thread, (err as Error).message, 'ERROR');
  }
}

function customRange(r: ParsedReport, tz: string) {
  if (r.period !== 'CUSTOM' || !r.from || !r.to) return { from: null, to: null };
  const end = startOfLocalDate(r.to, tz);
  return { from: startOfLocalDate(r.from, tz), to: end ? new Date(end.getTime() + 86_400_000) : null };
}

function statText(stat: Stat, report: Report, locale: string): string {
  if (stat.format === 'PERCENT') return `${stat.value}%`;
  if (stat.format === 'NUMBER') return String(stat.value);
  return formatMoney(stat.value, report.currency, locale);
}

async function runReport(ctx: Ctx, r: ParsedReport): Promise<ChatMessageDoc> {
  const { user } = ctx;
  const category = ctx.categories.find((c) => sameName(c.name, r.category));
  const report = await buildReport(scopeOf(ctx.tracker, user), {
    kind: r.kind,
    type: r.type,
    period: r.period === 'CUSTOM' ? null : r.period,
    ...customRange(r, user.timezone),
    categoryId: category?.id ?? null,
    limit: r.limit,
  });
  const first = report.stats[0];
  const summary = first ? `${first.label}: ${statText(first, report, user.locale)}` : '';
  const scope = category ? ` · ${category.name}` : '';
  const text = report.empty
    ? `No entries for ${report.subtitle} yet — nothing to chart.`
    : `${report.title}${scope} (${report.subtitle}). ${summary}`;
  const followUps = FOLLOW_UPS.filter((f) => f.kind !== r.kind)
    .slice(0, 3)
    .map((f) => option('PROMPT', f.label, f.label));
  return ChatMessage.create({ ...threadOf(ctx), role: 'ASSISTANT', kind: 'REPORT', text, report, options: withIds(followUps) });
}

async function hydrate(messages: ChatMessageDoc[]): Promise<ChatMessageOut[]> {
  const ids = messages.map((m) => m.transactionId).filter(Boolean);
  const txs = ids.length ? await Transaction.find({ _id: { $in: ids } }) : [];
  const byId = new Map(txs.map((t) => [t.id as string, t]));
  return messages.map((m) => toChatMessage(m, m.transactionId ? byId.get(String(m.transactionId)) : null));
}

export async function chatHistory(user: UserDoc, tracker: TrackerDoc, limit = 50, before?: Date | null) {
  const query: Record<string, unknown> = { userId: user._id, trackerId: tracker._id };
  if (before) query.createdAt = { $lt: before };
  const docs = await ChatMessage.find(query).sort({ createdAt: -1, _id: -1 }).limit(Math.min(limit, 200));
  return hydrate(docs.toReversed());
}

async function reply(ctx: Ctx, text: string, history: ChatMessageDoc[]): Promise<ChatMessageDoc[]> {
  const parsed = await parseMessage(text, parseContext(ctx, history));
  if (parsed.intent === 'LOG' && parsed.transactions.length) {
    if (!ctx.canEdit) return [await say(threadOf(ctx), viewOnlyText(ctx))];
    const out: ChatMessageDoc[] = [];
    for (const p of parsed.transactions.slice(0, 5)) out.push(await runDraft(ctx, draftFromParsed(p, ctx)));
    return out;
  }
  if (parsed.intent === 'REPORT' && parsed.report) return [await runReport(ctx, parsed.report)];
  const help = await ChatMessage.create({
    ...threadOf(ctx),
    role: 'ASSISTANT',
    kind: 'TEXT',
    text: parsed.reply || 'I can log expenses & income and build reports. Try one of these:',
    options: withIds(CHAT_SUGGESTIONS.slice(0, 5).map((s) => option('PROMPT', s, s))),
  });
  return [help];
}

export async function sendMessage(user: UserDoc, tracker: TrackerDoc, role: TrackerRole, text: string): Promise<ChatMessageOut[]> {
  const trimmed = text.trim();
  if (!trimmed) throw badInput('Message is empty');
  if (trimmed.length > 500) throw badInput('Message is too long (max 500 characters)');
  const thread = { userId: user._id, trackerId: tracker._id };
  const history = await ChatMessage.find(thread).sort({ createdAt: -1 }).limit(8);
  const userMsg = await ChatMessage.create({ ...thread, role: 'USER', kind: 'TEXT', text: trimmed });
  const ctx = await loadCtx(user, tracker, role);
  try {
    return await hydrate([userMsg, ...(await reply(ctx, trimmed, history.toReversed()))]);
  } catch (err) {
    console.error('Chat reply failed:', err);
    return hydrate([userMsg, await say(thread, (err as Error).message, 'ERROR')]);
  }
}

async function resolveChoice(ctx: Ctx, msg: ChatMessageDoc, action: string, value: string | null): Promise<ChatMessageDoc> {
  const thread = threadOf(ctx);
  if (action === 'CANCEL') return say(thread, 'Okay, cancelled. Nothing was logged.');
  if (!ctx.canEdit) return say(thread, viewOnlyText(ctx));
  if (action === 'UNDO') {
    const res = await Transaction.deleteOne({ _id: msg.transactionId, trackerId: ctx.tracker._id });
    return say(thread, res.deletedCount ? 'Done — removed that entry.' : 'That entry was already removed.');
  }
  const draft = msg.draft as Draft | null;
  if (!draft) throw badInput('Nothing to continue');
  try {
    await applyOption(ctx, draft, action, value);
    return await runDraft(ctx, draft);
  } catch (err) {
    return say(thread, (err as Error).message, 'ERROR');
  }
}

export async function chooseOption(user: UserDoc, messageId: string, optionId: string): Promise<ChatMessageOut[]> {
  const msg = await ChatMessage.findOne({ _id: messageId, userId: user._id });
  if (!msg) throw notFound('Message');
  const choice = msg.options.find((o) => o.id === optionId);
  if (!choice) throw badInput('Unknown option');
  const { tracker, role } = await loadTracker(user, String(msg.trackerId), 'VIEW');
  // Suggestion chips just send their text as a new message
  if (choice.action === 'PROMPT') return sendMessage(user, tracker, role, choice.value ?? choice.label);
  if (msg.resolved) throw badInput('This question was already answered');
  msg.resolved = true;
  msg.selectedOptionId = choice.id;
  await msg.save();
  const ctx = await loadCtx(user, tracker, role);
  return hydrate([msg, await resolveChoice(ctx, msg, choice.action, choice.value ?? null)]);
}

export async function clearChat(user: UserDoc, tracker: TrackerDoc) {
  await ChatMessage.deleteMany({ userId: user._id, trackerId: tracker._id });
  return true;
}
