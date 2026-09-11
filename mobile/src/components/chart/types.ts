import type { ChartType } from '@/lib/types';

export interface ChartSpec {
  type: ChartType;
  labels: string[];
  datasets: { label: string; data: number[]; color?: string | null; colors?: string[] | null }[];
  currency: string;
  locale: string;
  /** Draw bars on top of each other (income behind expense) like the design */
  overlap?: boolean;
  legend?: boolean;
  /** Axis/label colour (dark text on lime backgrounds) */
  textColor?: string;
  gridColor?: string;
}
