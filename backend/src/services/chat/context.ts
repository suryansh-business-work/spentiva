import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { Category, type CategoryDoc } from '../../models/Category.js';
import type { ChatMessageDoc } from '../../models/ChatMessage.js';
import { PaymentSource, type PaymentSourceDoc } from '../../models/PaymentSource.js';
import type { UserDoc } from '../../models/User.js';
import type { ParseContext } from '../ai.js';

export type TxType = 'EXPENSE' | 'INCOME';

export interface Ctx {
  user: UserDoc;
  categories: CategoryDoc[];
  sources: PaymentSourceDoc[];
}

export interface Option {
  id: string;
  label: string;
  action: string;
  value: string | null;
}

/** Case-insensitive name match */
export const sameName = (a?: string | null, b?: string | null) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

export const option = (action: string, label: string, value: string | null = null) => ({ action, label, value });

/** Give options stable ids (o1, o2 …) within one message */
export const withIds = (list: Omit<Option, 'id'>[]): Option[] => list.map((o, i) => ({ ...o, id: `o${i + 1}` }));

export const CANCEL = option('CANCEL', 'Cancel');

export async function loadCtx(user: UserDoc): Promise<Ctx> {
  const [categories, sources] = await Promise.all([
    Category.find({ userId: user._id }).sort({ name: 1 }),
    PaymentSource.find({ userId: user._id }).sort({ isDefault: -1, name: 1 }),
  ]);
  return { user, categories, sources };
}

function categoriesOf(ctx: Ctx, type: TxType) {
  return ctx.categories.filter((c) => c.type === type).map((c) => ({ name: c.name, items: c.items.map((i) => i.name) }));
}

/** Everything the AI needs to map a message onto the user's own categories/sources */
export function parseContext(ctx: Ctx, history: ChatMessageDoc[]): ParseContext {
  const now = new TZDate(Date.now(), ctx.user.timezone);
  return {
    today: format(now, 'yyyy-MM-dd'),
    weekday: format(now, 'EEEE'),
    timezone: ctx.user.timezone,
    currency: ctx.user.currency,
    expenseCategories: categoriesOf(ctx, 'EXPENSE'),
    incomeCategories: categoriesOf(ctx, 'INCOME'),
    sources: ctx.sources.map((s) => ({ name: s.name, isDefault: s.isDefault })),
    history: history.map((m) => ({ role: m.role === 'USER' ? 'user' : 'assistant', content: m.text })),
  };
}
