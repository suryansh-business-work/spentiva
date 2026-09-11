import OpenAI from 'openai';
import { z } from 'zod';
import { badInput } from '../utils/errors.js';
import { PERIODS } from '../utils/time.js';
import { getSetting } from './appSettings.js';
import { REPORT_KINDS } from './reports/index.js';

const INTENTS = ['LOG', 'REPORT', 'HELP', 'OTHER'] as const;
const REPORT_PERIODS = [...PERIODS, 'CUSTOM'] as const;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface ParseContext {
  today: string;
  weekday: string;
  timezone: string;
  currency: string;
  expenseCategories: { name: string; items: string[] }[];
  incomeCategories: { name: string; items: string[] }[];
  sources: { name: string; isDefault: boolean }[];
  history: { role: 'user' | 'assistant'; content: string }[];
}

const nullableStr = z.string().trim().min(1).nullable().catch(null);

const ParsedTxZ = z.object({
  type: z.enum(['EXPENSE', 'INCOME']).catch('EXPENSE'),
  typeConfident: z.boolean().catch(true),
  amount: z.number().positive().nullable().catch(null),
  currency: nullableStr,
  category: nullableStr,
  categoryGuess: nullableStr,
  categoryOptions: z.array(z.string()).catch([]),
  expenseOn: nullableStr,
  expenseOnGuess: nullableStr,
  source: nullableStr,
  sourceGuess: nullableStr,
  note: nullableStr,
  date: z.string().regex(ISO_DATE).nullable().catch(null),
});

const ParsedReportZ = z.object({
  kind: z.enum(REPORT_KINDS).catch('CATEGORY'),
  type: z.enum(['EXPENSE', 'INCOME']).nullable().catch(null),
  period: z.enum(REPORT_PERIODS).catch('THIS_MONTH'),
  from: z.string().regex(ISO_DATE).nullable().catch(null),
  to: z.string().regex(ISO_DATE).nullable().catch(null),
  category: nullableStr,
  limit: z.number().int().positive().nullable().catch(null),
});

const ParsedZ = z.object({
  intent: z.enum(INTENTS).catch('OTHER'),
  transactions: z.array(ParsedTxZ).catch([]),
  report: ParsedReportZ.nullable().catch(null),
  reply: z.string().catch(''),
});

export type ParsedTx = z.infer<typeof ParsedTxZ>;
export type ParsedReport = z.infer<typeof ParsedReportZ>;
export type Parsed = z.infer<typeof ParsedZ>;

// ---------- OpenAI structured output schema ----------

const str = (description: string) => ({ type: ['string', 'null'], description });

const TX_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { type: 'string', enum: ['EXPENSE', 'INCOME'] },
    typeConfident: { type: 'boolean' },
    amount: { type: ['number', 'null'] },
    currency: str('ISO 4217 code, only if the user mentioned a currency'),
    category: str('EXACT existing category name of the same type, or null'),
    categoryGuess: str('Title Case name for a new category when none fits'),
    categoryOptions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 existing category names that could fit' },
    expenseOn: str('EXACT existing item name under the chosen category, or null'),
    expenseOnGuess: str('Specific thing the user named that is not an existing item (Title Case)'),
    source: str('EXACT existing payment source name, or null'),
    sourceGuess: str('Payment source the user mentioned that does not exist (Title Case)'),
    note: str('Short extra detail such as merchant or person'),
    date: str('YYYY-MM-DD when the user refers to a day other than today'),
  },
  required: [
    'type',
    'typeConfident',
    'amount',
    'currency',
    'category',
    'categoryGuess',
    'categoryOptions',
    'expenseOn',
    'expenseOnGuess',
    'source',
    'sourceGuess',
    'note',
    'date',
  ],
};

const REPORT_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    kind: { type: 'string', enum: [...REPORT_KINDS] },
    type: { anyOf: [{ type: 'string', enum: ['EXPENSE', 'INCOME'] }, { type: 'null' }] },
    period: { type: 'string', enum: [...REPORT_PERIODS] },
    from: str('YYYY-MM-DD inclusive, only for CUSTOM'),
    to: str('YYYY-MM-DD inclusive, only for CUSTOM'),
    category: str('EXACT existing category name if the question is about one category'),
    limit: { type: ['integer', 'null'] },
  },
  required: ['kind', 'type', 'period', 'from', 'to', 'category', 'limit'],
};

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    intent: { type: 'string', enum: [...INTENTS] },
    transactions: { type: 'array', items: TX_JSON_SCHEMA },
    report: { anyOf: [REPORT_JSON_SCHEMA, { type: 'null' }] },
    reply: { type: 'string' },
  },
  required: ['intent', 'transactions', 'report', 'reply'],
};

function listCategories(list: ParseContext['expenseCategories']): string {
  if (!list.length) return '- (none)';
  return list.map((c) => (c.items.length ? `- ${c.name}: ${c.items.join(', ')}` : `- ${c.name}`)).join('\n');
}

function systemPrompt(ctx: ParseContext): string {
  const sources = ctx.sources.map((s) => (s.isDefault ? `${s.name} (default)` : s.name)).join(', ') || '(none)';
  return `You are Spentiva, a friendly expense-tracking assistant inside a chat. Convert the user's latest message into structured data.

Today is ${ctx.today} (${ctx.weekday}) in the user's time zone ${ctx.timezone}. Base currency: ${ctx.currency}.

EXPENSE categories (name: "expense on" items):
${listCategories(ctx.expenseCategories)}

INCOME categories:
${listCategories(ctx.incomeCategories)}

Payment sources ("expense from"): ${sources}

Rules:
- intent LOG when the user reports money spent or received ("spent 20 on food", "paid 500 rent via UPI", "salary 50000 aaya", "20 coffee"). One entry per distinct amount.
- type INCOME for money received (salary, got, received, earned, refund, cashback, credited); otherwise EXPENSE. typeConfident=false only when genuinely unclear.
- category: EXACT existing name of the same type when it clearly fits, using common sense and synonyms (lunch/pizza/zomato → Food, uber/petrol/metro → Transport). If the message names an existing item, use its category and set expenseOn to that item.
- If no existing category fits: category=null, categoryGuess=short Title Case name for a new category, categoryOptions=up to 3 closest existing names.
- If two or more categories fit about equally: category=null and list them in categoryOptions.
- expenseOn: EXACT existing item under the chosen category when it fits (petrol → Fuel), else null. If the user named a specific thing that is not an existing item, set expenseOnGuess to it (Title Case). Never repeat the category name as expenseOnGuess.
- source: EXACT existing payment source if mentioned or clearly implied (gpay/phonepe/paytm → UPI when UPI exists), else null. If the user mentioned a source that does not exist, set sourceGuess (Title Case).
- amount: plain number ("1.5k" → 1500, "2 lakh" → 200000); null if missing.
- currency: ISO 4217 only when explicitly mentioned ($ → USD, € → EUR, £ → GBP, ₹/rs → INR), else null.
- date: YYYY-MM-DD only when the user mentions a day other than today, else null.
- intent REPORT when the user asks for totals, charts, summaries, trends, averages, top spending or comparisons. kind:
  CATEGORY (by category), EXPENSE_ON (by item), SOURCE (by payment source), DAILY (day-wise), MONTHLY (month-wise),
  TOP (top / most spending), AVERAGE (average spend), INCOME_VS_EXPENSE (income vs expense, savings, ratio).
  period: best named period, default THIS_MONTH (MONTHLY → LAST_6_MONTHS). CUSTOM with from/to for explicit dates or a named month (the most recent one).
  type: EXPENSE unless the user asks about income; null for INCOME_VS_EXPENSE and when both are wanted.
- Use the conversation history to complete follow-ups (e.g. assistant asked "How much?" and the user replies "20").
- intent HELP for greetings or how-to questions, OTHER for anything unrelated; then transactions=[] and report=null.
- reply: one short friendly sentence in the user's language and style (Hinglish is fine).`;
}

let cached: { key: string; openai: OpenAI } | null = null;

async function openAi(): Promise<{ openai: OpenAI; model: string }> {
  const key = await getSetting('OPENAI_API_KEY');
  if (!key) throw badInput('OpenAI is not configured. An admin can add the API key in Profile → Environment variables.');
  if (cached?.key !== key) cached = { key, openai: new OpenAI({ apiKey: key, timeout: 25_000, maxRetries: 2 }) };
  return { openai: cached.openai, model: (await getSetting('OPENAI_MODEL')) ?? 'gpt-4o' };
}

export async function testOpenAi(): Promise<string> {
  const ai = await openAi();
  const res = await ai.openai.chat.completions.create({
    model: ai.model,
    max_tokens: 5,
    messages: [{ role: 'user', content: 'Reply with OK' }],
  });
  return `${ai.model}: ${res.choices[0]?.message?.content?.trim() ?? 'OK'}`;
}

const CHAT_MODEL = /^(gpt-|o\d|chatgpt)/;
const NON_CHAT = /(audio|realtime|tts|transcribe|image|search|embedding)/;

/** Chat-capable models available to the configured key (the current model is always listed first) */
export async function listOpenAiModels(): Promise<string[]> {
  const configured = (await getSetting('OPENAI_MODEL')) ?? 'gpt-4o';
  if (!(await getSetting('OPENAI_API_KEY'))) return [configured];
  const { openai } = await openAi();
  const ids: string[] = [];
  for await (const m of openai.models.list()) {
    if (CHAT_MODEL.test(m.id) && !NON_CHAT.test(m.id)) ids.push(m.id);
  }
  ids.sort((a, b) => a.localeCompare(b));
  return [...new Set([configured, ...ids])];
}

/** Parse a chat message with OpenAI structured outputs */
export async function parseMessage(text: string, ctx: ParseContext): Promise<Parsed> {
  const ai = await openAi();
  const completion = await ai.openai.chat.completions.create({
    model: ai.model,
    temperature: 0.1,
    messages: [{ role: 'system', content: systemPrompt(ctx) }, ...ctx.history, { role: 'user', content: text }],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'spentiva_message', strict: true, schema: RESPONSE_SCHEMA },
    },
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw badInput('The AI returned an empty answer, please try again.');
  return ParsedZ.parse(JSON.parse(content));
}
