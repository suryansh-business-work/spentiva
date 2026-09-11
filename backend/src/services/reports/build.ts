import type { UserDoc } from '../../models/User.js';
import { formatRange } from '../../utils/time.js';
import { BUILDERS } from './builders.js';
import { resolveRange } from './queries.js';
import type { Report, ReportParams } from './types.js';

/** Chart-ready report (labels, datasets, key stats) for any kind/period */
export function buildReport(user: UserDoc, params: ReportParams): Promise<Report> {
  const range = resolveRange(user, params);
  return BUILDERS[params.kind]({
    user,
    params,
    type: params.type ?? 'EXPENSE',
    range,
    base: { kind: params.kind, currency: user.currency, from: range.from, to: range.to, subtitle: formatRange(range, user.timezone) },
  });
}
