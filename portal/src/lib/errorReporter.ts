import { APP_VERSION } from '@/config';
import type { ClientLogInput, LogLevel } from '@/gql/graphql';
import { ReportLogsMutation } from '@/graphql/logs';
import { gql } from './api';

const DEDUPE_MS = 10_000;
const recent = new Map<string, number>();

const toError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  return new Error(typeof err === 'string' ? err : JSON.stringify(err));
};

/** Sends a portal error to Logs (source PORTAL). The same message is sent at most once every 10 s. */
export function reportError(err: unknown, where: string, level: LogLevel = 'ERROR'): void {
  const error = toError(err);
  const key = `${level}|${error.message}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < DEDUPE_MS) return;
  recent.set(key, now);

  const entry: ClientLogInput = {
    level,
    source: 'PORTAL',
    message: error.message || error.name,
    stack: error.stack ?? null,
    url: globalThis.location.href,
    appVersion: APP_VERSION,
    platform: 'web',
    device: navigator.userAgent,
    context: JSON.stringify({ where }),
    occurredAt: new Date().toISOString(),
  };
  gql(ReportLogsMutation, { input: [entry] }).catch((e: unknown) => console.error('Could not report the error to Spentiva', e));
}

/** Uncaught errors and unhandled promise rejections anywhere in the portal */
export function installErrorReporter(): void {
  globalThis.addEventListener('error', (e) => reportError(e.error ?? e.message, 'window.error'));
  globalThis.addEventListener('unhandledrejection', (e) => reportError(e.reason, 'unhandledrejection'));
}
