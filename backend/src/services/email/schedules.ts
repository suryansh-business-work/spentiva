import { TZDate } from '@date-fns/tz';
import { addDays, addMonths, addQuarters, addYears, setHours, startOfDay, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import type { Types } from 'mongoose';
import { REPORT_EMAIL_HOUR } from '../../config/rules.js';
import { REPORT_FREQUENCIES, ReportSchedule, type ReportFrequency, type ReportScheduleDoc } from '../../models/ReportSchedule.js';
import type { PeriodKey } from '../../utils/time.js';

/** Periods a report email can cover ("send now" and the scheduled ones) */
export const EMAIL_PERIODS = [
  'TODAY',
  'YESTERDAY',
  'THIS_MONTH',
  'LAST_MONTH',
  'THIS_QUARTER',
  'LAST_QUARTER',
  'THIS_YEAR',
  'LAST_YEAR',
] as const satisfies readonly PeriodKey[];

/** Each scheduled report covers the period that just ended */
export const PERIOD_OF: Record<ReportFrequency, PeriodKey> = {
  DAILY: 'YESTERDAY',
  MONTHLY: 'LAST_MONTH',
  QUARTERLY: 'LAST_QUARTER',
  YEARLY: 'LAST_YEAR',
};

const CYCLE: Record<ReportFrequency, { start: (d: TZDate) => TZDate; next: (d: TZDate) => TZDate }> = {
  DAILY: { start: startOfDay, next: (d) => addDays(d, 1) },
  MONTHLY: { start: startOfMonth, next: (d) => addMonths(d, 1) },
  QUARTERLY: { start: startOfQuarter, next: (d) => addQuarters(d, 1) },
  YEARLY: { start: startOfYear, next: (d) => addYears(d, 1) },
};

/** The reporting hour on the first day of the next day / month / quarter / year, in the user's zone */
export function nextRunAt(frequency: ReportFrequency, timezone: string, after: Date = new Date()): Date {
  const now = new TZDate(after.getTime(), timezone);
  const { start, next } = CYCLE[frequency];
  const thisCycle = setHours(start(now), REPORT_EMAIL_HOUR);
  const run = thisCycle > now ? thisCycle : setHours(next(start(now)), REPORT_EMAIL_HOUR);
  return new Date(run.getTime());
}

const ORDER = new Map(REPORT_FREQUENCIES.map((f, i) => [f, i]));
const byFrequency = (a: ReportScheduleDoc, b: ReportScheduleDoc) => (ORDER.get(a.frequency) ?? 0) - (ORDER.get(b.frequency) ?? 0);

export async function listSchedules(userId: Types.ObjectId, trackerId: Types.ObjectId): Promise<ReportScheduleDoc[]> {
  return (await ReportSchedule.find({ userId, trackerId })).toSorted(byFrequency);
}

/** Exactly these reports stay on; new ones get their first send time, existing ones keep theirs */
export async function setSchedules(
  userId: Types.ObjectId,
  trackerId: Types.ObjectId,
  timezone: string,
  frequencies: ReportFrequency[],
): Promise<ReportScheduleDoc[]> {
  await ReportSchedule.deleteMany({ userId, trackerId, frequency: { $nin: frequencies } });
  await Promise.all(
    [...new Set(frequencies)].map((frequency) =>
      ReportSchedule.updateOne({ userId, trackerId, frequency }, { $setOnInsert: { nextRunAt: nextRunAt(frequency, timezone) } }, { upsert: true }),
    ),
  );
  return listSchedules(userId, trackerId);
}
