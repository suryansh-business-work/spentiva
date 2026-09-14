import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { LOG_LIMITS } from '../config/rules.js';

export const LOG_LEVELS = ['FATAL', 'ERROR', 'WARN', 'INFO'] as const;
export const LOG_SOURCES = ['APP', 'PORTAL', 'API'] as const;

/** Crash / error reports from the app, the portal and the API itself (shown in the portal's Logs) */
const AppLogSchema = new Schema(
  {
    level: { type: String, enum: LOG_LEVELS, required: true },
    source: { type: String, enum: LOG_SOURCES, required: true },
    message: { type: String, required: true },
    stack: { type: String, default: null },
    /** Where it happened: app screen route, portal page URL or API operation */
    url: { type: String, default: null },
    /** Signed-in user at the time (null before login); email is kept even if the user is deleted */
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userEmail: { type: String, default: null },
    appVersion: { type: String, default: null },
    buildNumber: { type: String, default: null },
    /** android | ios | web | server */
    platform: { type: String, default: null },
    osVersion: { type: String, default: null },
    device: { type: String, default: null },
    apiUrl: { type: String, default: null },
    /** JSON text with anything else the reporter attached */
    context: { type: String, default: null },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    /** Same error = same fingerprint, used to count occurrences and resolve them together */
    fingerprint: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

AppLogSchema.index({ occurredAt: -1 });
AppLogSchema.index({ level: 1, occurredAt: -1 });
AppLogSchema.index({ userId: 1, occurredAt: -1 });
AppLogSchema.index({ fingerprint: 1, occurredAt: -1 });
AppLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: LOG_LIMITS.retentionDays * 24 * 3600 });

export type AppLogDoc = HydratedDocument<InferSchemaType<typeof AppLogSchema>>;
export const AppLog = model('AppLog', AppLogSchema);
