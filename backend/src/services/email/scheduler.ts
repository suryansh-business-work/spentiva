import { ReportSchedule, type ReportScheduleDoc } from '../../models/ReportSchedule.js';
import { Tracker } from '../../models/Tracker.js';
import { User } from '../../models/User.js';
import { recordServerError } from '../logs.js';
import { roleOf } from '../trackers/access.js';
import { sendTrackerReport } from './index.js';
import { PERIOD_OF, nextRunAt } from './schedules.js';

const TICK_MS = 5 * 60_000;
const FIRST_TICK_MS = 30_000;
const BATCH = 50;

/** Sends one due report. The next run is claimed first, so a crash mid-send never repeats an email. */
async function runSchedule(schedule: ReportScheduleDoc): Promise<void> {
  const [user, tracker] = await Promise.all([User.findById(schedule.userId), Tracker.findById(schedule.trackerId)]);
  if (!user || !tracker || !roleOf(tracker, user._id)) {
    await schedule.deleteOne();
    return;
  }
  const next = nextRunAt(schedule.frequency, user.timezone);
  const claimed = await ReportSchedule.updateOne({ _id: schedule._id, nextRunAt: schedule.nextRunAt }, { $set: { nextRunAt: next } });
  if (claimed.modifiedCount === 0 || user.disabled) return;
  try {
    const sent = await sendTrackerReport(user, tracker, PERIOD_OF[schedule.frequency], schedule.frequency);
    await ReportSchedule.updateOne({ _id: schedule._id }, { $set: { lastError: null, ...(sent && { lastSentAt: new Date() }) } });
  } catch (err) {
    recordServerError(err, `email report · ${schedule.frequency}`, String(user._id), null);
    await ReportSchedule.updateOne({ _id: schedule._id }, { $set: { lastError: (err as Error).message.slice(0, 300) } });
  }
}

let running = false;

async function tick(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const due = await ReportSchedule.find({ nextRunAt: { $lte: new Date() } })
      .sort({ nextRunAt: 1 })
      .limit(BATCH);
    for (const schedule of due) await runSchedule(schedule);
  } finally {
    running = false;
  }
}

/** Checks every few minutes for daily / monthly / quarterly / yearly reports that are due (the API runs as one container) */
export function startReportScheduler(): void {
  const run = () => {
    tick().catch((err: unknown) => recordServerError(err, 'email report · scheduler', null, null));
  };
  setTimeout(run, FIRST_TICK_MS);
  setInterval(run, TICK_MS);
}
