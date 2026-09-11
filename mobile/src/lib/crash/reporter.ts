import type { ClientLogInput, LogLevel } from '@/gql/graphql';
import { ReportLogsMutation } from '@/graphql/support';
import { ApiError, getApiUrl, gql } from '../api';
import { APP_META } from './meta';
import { currentRoute } from './route';
import { readPending, writePending } from './store';

const SEND_TIMEOUT_MS = 4000;
const BATCH_DELAY_MS = 2000;
const DEDUPE_MS = 10_000;
const BATCH = 20;

let queue: ClientLogInput[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const recent = new Map<string, number>();

const toError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  return new Error(typeof err === 'string' ? err : JSON.stringify(err));
};

function entry(level: LogLevel, err: unknown, context?: Record<string, unknown>): ClientLogInput {
  const error = toError(err);
  return {
    level,
    source: 'APP',
    message: error.message || error.name,
    stack: error.stack ?? null,
    url: currentRoute(),
    apiUrl: getApiUrl(),
    ...APP_META,
    context: context ? JSON.stringify(context) : null,
    occurredAt: new Date().toISOString(),
  };
}

function isDuplicate(e: ClientLogInput): boolean {
  const key = `${e.level}|${e.message}`;
  const now = Date.now();
  const duplicate = now - (recent.get(key) ?? 0) < DEDUPE_MS;
  recent.set(key, now);
  return duplicate;
}

const send = (entries: ClientLogInput[]) => gql(ReportLogsMutation, { input: entries }, SEND_TIMEOUT_MS);

/** Expected API answers (wrong password, offline, not allowed…) are not bugs and are not reported */
export const isReportable = (err: unknown) => !(err instanceof ApiError) || err.code === 'SERVER' || err.code === 'INTERNAL_SERVER_ERROR';

function flushQueue() {
  timer = null;
  const batch = queue.splice(0, BATCH);
  send(batch).catch((err: unknown) => {
    console.warn('[crash] report not sent, kept for the next launch', err);
    writePending([...readPending(), ...batch]);
  });
  if (queue.length) timer = setTimeout(flushQueue, BATCH_DELAY_MS);
}

/** Non-fatal problem: batched and sent a moment later */
export function reportLog(level: LogLevel, err: unknown, context?: Record<string, unknown>): void {
  const e = entry(level, err, context);
  if (isDuplicate(e)) return;
  queue = [...queue, e];
  timer ??= setTimeout(flushQueue, BATCH_DELAY_MS);
}

/** The app is about to close: the report goes to disk first, then out right away */
export async function reportFatal(err: unknown): Promise<void> {
  const pending = [...readPending(), entry('FATAL', err, { fatal: true })];
  writePending(pending);
  await send(pending.slice(-BATCH));
  writePending([]);
}

/** Sends what earlier sessions could not (called once the session and server URL are restored) */
export async function flushPendingLogs(): Promise<void> {
  const pending = readPending();
  if (pending.length === 0) return;
  await send(pending.slice(0, BATCH));
  writePending(pending.slice(BATCH));
}
