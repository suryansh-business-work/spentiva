import type { PeriodKey, Range } from '../../utils/time.js';
import type { UserDoc } from '../../models/User.js';

export const REPORT_KINDS = ['CATEGORY', 'EXPENSE_ON', 'SOURCE', 'DAILY', 'MONTHLY', 'TOP', 'AVERAGE', 'INCOME_VS_EXPENSE'] as const;
export type ReportKind = (typeof REPORT_KINDS)[number];
export type TxType = 'EXPENSE' | 'INCOME';
export type ChartType = 'bar' | 'barH' | 'line' | 'doughnut' | 'pie';
export type StatFormat = 'CURRENCY' | 'PERCENT' | 'NUMBER';

export interface Stat {
  label: string;
  value: number;
  format: StatFormat;
  hint: string | null;
}

export interface Dataset {
  label: string;
  data: number[];
  color: string | null;
  colors: string[] | null;
}

export interface Report {
  kind: ReportKind;
  title: string;
  subtitle: string;
  chartType: ChartType;
  labels: string[];
  datasets: Dataset[];
  stats: Stat[];
  currency: string;
  from: Date;
  to: Date;
  empty: boolean;
}

export interface ReportParams {
  kind: ReportKind;
  type?: TxType | null;
  period?: PeriodKey | null;
  /** YYYY-MM calendar month in the user's time zone */
  month?: string | null;
  from?: Date | null;
  to?: Date | null;
  categoryId?: string | null;
  limit?: number | null;
}

/** What every per-kind builder receives */
export interface BuildCtx {
  user: UserDoc;
  params: ReportParams;
  type: TxType;
  range: Range;
  base: Pick<Report, 'kind' | 'currency' | 'from' | 'to' | 'subtitle'>;
}

export const INCOME_COLOR = '#B5E36C';
export const EXPENSE_COLOR = '#4E9A0E';
export const PALETTE = ['#5DA314', '#F2B705', '#E5484D', '#3B82F6', '#8B5CF6', '#22C3E6', '#F97316', '#EC4899', '#14B8A6', '#6B7280'];
