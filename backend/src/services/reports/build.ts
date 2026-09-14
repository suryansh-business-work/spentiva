import { formatRange } from '../../utils/time.js';
import { BUILDERS } from './builders.js';
import { resolveRange } from './queries.js';
import type { Report, ReportParams, ReportScope } from './types.js';

/** Chart-ready report (labels, datasets, key stats) for any kind/period */
export function buildReport(scope: ReportScope, params: ReportParams): Promise<Report> {
  const range = resolveRange(scope, params);
  return BUILDERS[params.kind]({
    scope,
    params,
    type: params.type ?? 'EXPENSE',
    range,
    base: { kind: params.kind, currency: scope.currency, from: range.from, to: range.to, subtitle: formatRange(range, scope.timezone) },
  });
}
