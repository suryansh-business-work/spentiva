import type { Types } from 'mongoose';
import type { UserDoc } from '../models/User.js';
import type { CategoryDoc } from '../models/Category.js';
import type { PaymentSourceDoc } from '../models/PaymentSource.js';
import type { ReportScheduleDoc } from '../models/ReportSchedule.js';
import type { TrackerDoc } from '../models/Tracker.js';
import type { TransactionDoc } from '../models/Transaction.js';
import type { ChatMessageDoc } from '../models/ChatMessage.js';
import type { AppLogDoc } from '../models/AppLog.js';
import type { SupportTicketDoc } from '../models/SupportTicket.js';
import type { TicketUser } from '../services/support.js';
import { roleOf, type Person } from '../services/trackers/index.js';
import type { UserCounts } from '../services/users.js';

const idOrNull = (v: unknown) => (v ? String(v) : null);

export const toUser = (u: UserDoc) => ({
  id: u.id as string,
  name: u.name,
  email: u.email,
  currency: u.currency,
  timezone: u.timezone,
  locale: u.locale,
  /** Deprecated: budgets belong to trackers */
  monthlyBudget: null,
  isAdmin: u.role === 'ADMIN',
  createdAt: u.createdAt,
});

const someone = (id: string): Person => ({ id, name: 'Former member', email: '' });

/** A tracker as seen by one user: their role, and the owner followed by everyone it is shared with */
export function toTracker(t: TrackerDoc, viewerId: Types.ObjectId, people: Map<string, Person>, defaultId: string | null) {
  const person = (id: Types.ObjectId) => people.get(String(id)) ?? someone(String(id));
  const owner = person(t.ownerId);
  return {
    id: t.id as string,
    name: t.name,
    kind: t.kind,
    currency: t.currency,
    monthlyBudget: t.monthlyBudget ?? null,
    role: roleOf(t, viewerId) ?? 'VIEWER',
    isDefault: t.id === defaultId,
    owner,
    members: [
      { user: owner, role: 'OWNER', addedAt: t.createdAt },
      ...t.members.map((m) => ({ user: person(m.userId), role: m.role, addedAt: m.addedAt })),
    ],
    createdAt: t.createdAt,
  };
}

export const toSchedule = (s: ReportScheduleDoc) => ({
  frequency: s.frequency,
  nextRunAt: s.nextRunAt,
  lastSentAt: s.lastSentAt ?? null,
  lastError: s.lastError ?? null,
});

export const toCategory = (c: CategoryDoc) => ({
  id: c.id as string,
  name: c.name,
  type: c.type,
  icon: c.icon,
  color: c.color,
  items: c.items.map((i) => ({ id: String(i._id), name: i.name })),
});

export const toSource = (s: PaymentSourceDoc) => ({
  id: s.id as string,
  name: s.name,
  icon: s.icon,
  isDefault: s.isDefault,
});

export const toTransaction = (t: TransactionDoc) => ({
  id: t.id as string,
  type: t.type,
  amount: t.amount,
  currency: t.currency,
  amountBase: t.amountBase,
  baseCurrency: t.baseCurrency,
  fxRate: t.fxRate,
  categoryId: idOrNull(t.categoryId),
  categoryName: t.categoryName,
  expenseOnId: idOrNull(t.expenseOnId),
  expenseOnName: t.expenseOnName ?? null,
  sourceId: idOrNull(t.sourceId),
  sourceName: t.sourceName ?? null,
  note: t.note ?? null,
  occurredAt: t.occurredAt,
  via: t.via,
  addedById: String(t.userId),
  addedByName: t.userName ?? null,
  createdAt: t.createdAt,
});

export type TransactionOut = ReturnType<typeof toTransaction>;

export const toChatMessage = (m: ChatMessageDoc, tx?: TransactionDoc | null) => ({
  id: m.id as string,
  role: m.role,
  kind: m.kind,
  text: m.text,
  transaction: tx ? toTransaction(tx) : null,
  options: m.options.map((o) => ({ id: o.id, label: o.label, action: o.action, value: o.value ?? null })),
  selectedOptionId: m.selectedOptionId ?? null,
  resolved: m.resolved,
  report: m.report ?? null,
  createdAt: m.createdAt,
});

export type ChatMessageOut = ReturnType<typeof toChatMessage>;

export const toLog = (l: AppLogDoc) => ({
  id: l.id as string,
  level: l.level,
  source: l.source,
  message: l.message,
  stack: l.stack ?? null,
  url: l.url ?? null,
  userId: idOrNull(l.userId),
  userEmail: l.userEmail ?? null,
  appVersion: l.appVersion ?? null,
  buildNumber: l.buildNumber ?? null,
  platform: l.platform ?? null,
  osVersion: l.osVersion ?? null,
  device: l.device ?? null,
  apiUrl: l.apiUrl ?? null,
  context: l.context ?? null,
  ip: l.ip ?? null,
  userAgent: l.userAgent ?? null,
  fingerprint: l.fingerprint,
  occurredAt: l.occurredAt,
  createdAt: l.createdAt,
  resolved: l.resolved,
  resolvedAt: l.resolvedAt ?? null,
});

export const toTicket = (t: SupportTicketDoc, user: TicketUser | null = null) => ({
  id: t.id as string,
  subject: t.subject,
  category: t.category,
  status: t.status,
  priority: t.priority,
  messages: t.messages.map((m) => ({ id: String(m._id), author: m.author, authorName: m.authorName, body: m.body, createdAt: m.createdAt })),
  messageCount: t.messages.length,
  lastAuthor: t.messages.at(-1)?.author ?? 'USER',
  user,
  appVersion: t.appVersion ?? null,
  platform: t.platform ?? null,
  lastMessageAt: t.lastMessageAt,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export const toAdminUser = (u: UserDoc, counts: UserCounts) => ({
  id: u.id as string,
  name: u.name,
  email: u.email,
  role: u.role,
  disabled: u.disabled,
  currency: u.currency,
  timezone: u.timezone,
  locale: u.locale,
  appVersion: u.appVersion ?? null,
  platform: u.platform ?? null,
  lastSeenAt: u.lastSeenAt ?? null,
  createdAt: u.createdAt,
  transactionCount: counts.transactions.get(u.id as string) ?? 0,
  errorCount: counts.errors.get(u.id as string) ?? 0,
  ticketCount: counts.tickets.get(u.id as string) ?? 0,
});
