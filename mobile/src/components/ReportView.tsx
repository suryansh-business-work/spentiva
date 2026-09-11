import { memo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { money } from '@/lib/format';
import type { Report, Stat } from '@/lib/types';
import { C } from '@/theme/colors';
import { ChartView } from './chart/ChartView';

export function formatStat(stat: Stat, currency: string, locale: string) {
  if (stat.format === 'PERCENT') return `${stat.value.toFixed(stat.value < 10 ? 1 : 0)}%`;
  if (stat.format === 'NUMBER') return String(Math.round(stat.value));
  return money(stat.value, currency, locale);
}

interface StatGridProps {
  stats: Stat[];
  currency: string;
  locale: string;
}

export function StatGrid({ stats, currency, locale }: Readonly<StatGridProps>) {
  return (
    <XStack flexWrap="wrap" marginHorizontal={-5}>
      {stats.map((s) => (
        <YStack key={s.label} width="50%" padding={5}>
          <YStack backgroundColor={C.bg} borderRadius={16} padding={12} gap={2}>
            <Text fontSize={12} color={C.sub} numberOfLines={1}>
              {s.label}
            </Text>
            <Text fontSize={16} fontWeight="800" color={C.ink} numberOfLines={1}>
              {formatStat(s, currency, locale)}
            </Text>
            {s.hint ? (
              <Text fontSize={11} color={C.green} fontWeight="600" numberOfLines={1}>
                {s.hint}
              </Text>
            ) : null}
          </YStack>
        </YStack>
      ))}
    </XStack>
  );
}

interface ReportViewProps {
  report: Report;
  locale: string;
  height?: number;
  compact?: boolean;
}

/** Chart (Chart.js) + key stats for any server report */
export const ReportView = memo(function ReportView({ report, locale, height = 230, compact }: Readonly<ReportViewProps>) {
  const round = report.chartType === 'doughnut' || report.chartType === 'pie';
  const multi = report.datasets.length > 1;
  return (
    <YStack gap={10}>
      {report.empty ? (
        <YStack height={compact ? 90 : 160} alignItems="center" justifyContent="center" backgroundColor={C.bg} borderRadius={18}>
          <Text color={C.sub}>No data for this period yet</Text>
        </YStack>
      ) : (
        <ChartView
          height={round ? height + 30 : height}
          spec={{
            type: report.chartType,
            labels: report.labels,
            datasets: report.datasets,
            currency: report.currency,
            locale,
            overlap: multi && report.kind === 'DAILY',
            legend: round || multi,
          }}
        />
      )}
      <StatGrid stats={compact ? report.stats.slice(0, 2) : report.stats} currency={report.currency} locale={locale} />
    </YStack>
  );
});
