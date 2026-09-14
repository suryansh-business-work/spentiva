import { reportFatal, reportLog } from './reporter';

/**
 * Imported first by the app entry (index.ts), before any screen module loads, so even a crash
 * while the app starts is reported: who (the signed-in user), when, why (message + stack),
 * where (screen) and on which build/device. Fatal errors are written to disk and sent before
 * React Native's own handler closes the app; anything unsent goes out on the next launch.
 */
const previous = ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
  if (!isFatal) {
    reportLog('ERROR', error);
    previous(error, isFatal);
    return;
  }
  reportFatal(error)
    .catch((err: unknown) => console.warn('[crash] report not sent, kept for the next launch', err))
    .finally(() => previous(error, isFatal));
});

type RejectionTracker = (options: { allRejections: boolean; onUnhandled: (id: number, rejection: unknown) => void }) => void;
const hermes = (globalThis as { HermesInternal?: { enablePromiseRejectionTracker?: RejectionTracker } }).HermesInternal;

// Release builds don't track unhandled promise rejections at all (dev builds show them in LogBox)
if (!__DEV__) {
  hermes?.enablePromiseRejectionTracker?.({
    allRejections: true,
    onUnhandled: (_id, rejection) => reportLog('ERROR', rejection, { unhandledRejection: true }),
  });
}
