import type { ReportFrequency } from '../../models/ReportSchedule.js';
import type { TrackerDoc } from '../../models/Tracker.js';
import type { UserDoc } from '../../models/User.js';
import type { PeriodKey } from '../../utils/time.js';
import { sendMail } from './mailer.js';
import { renderMjml } from './mjml.js';
import { buildReportData } from './reportData.js';
import { reportEmail } from './templates/report.js';
import { testEmail } from './templates/test.js';

export { EMAIL_PERIODS, PERIOD_OF, listSchedules, nextRunAt, setSchedules } from './schedules.js';

/**
 * Emails a tracker's report for a period to the user. Scheduled reports (`frequency` set) are skipped
 * when nothing was logged; returns whether an email went out.
 */
export async function sendTrackerReport(
  user: UserDoc,
  tracker: TrackerDoc,
  period: PeriodKey,
  frequency: ReportFrequency | null = null,
): Promise<boolean> {
  const data = await buildReportData(user, tracker, period);
  if (frequency && data.count === 0) return false;
  const email = reportEmail(data, frequency);
  await sendMail({ to: user.email, subject: email.subject, html: await renderMjml(email.mjml), text: email.text });
  return true;
}

/** Portal → Settings → Email: proves the SMTP settings work */
export async function sendTestEmail(user: UserDoc): Promise<string> {
  const email = testEmail(user.name);
  await sendMail({ to: user.email, subject: email.subject, html: await renderMjml(email.mjml), text: email.text });
  return user.email;
}
