import { isReportable, reportLog } from './crash';

/** Error sink for fire-and-forget promises (haptics, storage, background refreshes); unexpected ones go to the portal's Logs */
export const logError =
  (scope: string) =>
  (err: unknown): void => {
    console.warn(`[${scope}]`, err);
    if (isReportable(err)) reportLog('WARN', err, { scope });
  };

/** Wrap an async handler for props that expect `() => void` (errors are logged, UI shows mutation state) */
export const runAsync = (scope: string, task: () => Promise<unknown>) => (): void => {
  task().catch(logError(scope));
};
