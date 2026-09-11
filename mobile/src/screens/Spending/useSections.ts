import { useMemo } from 'react';
import { dayLabel, localDateKey } from '@/lib/format';
import type { Transaction, User } from '@/lib/types';

export interface DaySection {
  key: string;
  title: string;
  /** Net for the day in the tracker's currency (income − expense) */
  net: number;
  data: Transaction[];
}

/** Group transactions by local day (user's time zone), newest first */
export function useSections(items: Transaction[], user: User): DaySection[] {
  return useMemo(() => {
    const groups = new Map<string, DaySection>();
    for (const tx of items) {
      const key = localDateKey(tx.occurredAt, user.timezone);
      let group = groups.get(key);
      if (!group) {
        group = { key, title: dayLabel(tx.occurredAt, user), net: 0, data: [] };
        groups.set(key, group);
      }
      group.data.push(tx);
      group.net += tx.type === 'EXPENSE' ? -tx.amountBase : tx.amountBase;
    }
    return [...groups.values()];
  }, [items, user]);
}
