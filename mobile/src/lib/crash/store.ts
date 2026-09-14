import { File, Paths } from 'expo-file-system';
import type { ClientLogInput } from '@/gql/graphql';

const MAX_PENDING = 20;
const pendingFile = () => new File(Paths.document, 'spentiva-pending-logs.json');

/**
 * Reports that couldn't be sent yet (the app closed, or the phone was offline). Written
 * synchronously because a crash gives no time for async storage.
 */
export function readPending(): ClientLogInput[] {
  const file = pendingFile();
  if (!file.exists) return [];
  try {
    const parsed: unknown = JSON.parse(file.textSync());
    return Array.isArray(parsed) ? (parsed as ClientLogInput[]) : [];
  } catch (err) {
    console.warn('[crash] unreadable pending reports, dropping them', err);
    return [];
  }
}

export function writePending(entries: ClientLogInput[]): void {
  const file = pendingFile();
  if (entries.length) file.write(JSON.stringify(entries.slice(-MAX_PENDING)));
  else if (file.exists) file.delete();
}
