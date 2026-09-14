import { z } from 'zod';
import { REPORT_FREQUENCY_OPTIONS } from '@/lib/constants';
import type { EmailReportSchedule, ReportFrequency } from '@/lib/types';

/** One on/off switch per report (daily, monthly, quarterly, yearly) */
export const emailReportsSchema = z.object({
  DAILY: z.boolean(),
  MONTHLY: z.boolean(),
  QUARTERLY: z.boolean(),
  YEARLY: z.boolean(),
});

export type EmailReportsValues = z.infer<typeof emailReportsSchema>;

export function emailReportsDefaults(schedules: EmailReportSchedule[]): EmailReportsValues {
  const on = new Set(schedules.map((s) => s.frequency));
  return { DAILY: on.has('DAILY'), MONTHLY: on.has('MONTHLY'), QUARTERLY: on.has('QUARTERLY'), YEARLY: on.has('YEARLY') };
}

export const toFrequencies = (v: EmailReportsValues): ReportFrequency[] => REPORT_FREQUENCY_OPTIONS.map((o) => o.value).filter((f) => v[f]);
