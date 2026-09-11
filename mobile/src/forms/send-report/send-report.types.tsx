import { z } from 'zod';
import { EMAIL_PERIOD_OPTIONS } from '@/lib/constants';
import type { Period } from '@/lib/types';

const PERIODS = EMAIL_PERIOD_OPTIONS.map((o) => o.value) as [Period, ...Period[]];

/** The day, month, quarter or year to email a report for right away */
export const sendReportSchema = z.object({ period: z.enum(PERIODS, 'Pick a period') });

export type SendReportValues = z.infer<typeof sendReportSchema>;

export const sendReportDefaults: SendReportValues = { period: 'THIS_MONTH' };
