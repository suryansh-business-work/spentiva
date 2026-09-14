import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

export const REPORT_FREQUENCIES = ['DAILY', 'MONTHLY', 'QUARTERLY', 'YEARLY'] as const;
export type ReportFrequency = (typeof REPORT_FREQUENCIES)[number];

/** A user's email report subscription for one tracker (exists = turned on) */
const ReportScheduleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    frequency: { type: String, enum: REPORT_FREQUENCIES, required: true },
    /** Next send time (the reporting hour in the user's time zone) */
    nextRunAt: { type: Date, required: true },
    lastSentAt: { type: Date, default: null },
    lastError: { type: String, default: null },
  },
  { timestamps: true },
);

ReportScheduleSchema.index({ userId: 1, trackerId: 1, frequency: 1 }, { unique: true });
ReportScheduleSchema.index({ nextRunAt: 1 });

export type ReportScheduleDoc = HydratedDocument<InferSchemaType<typeof ReportScheduleSchema>>;
export const ReportSchedule = model('ReportSchedule', ReportScheduleSchema);
