import type { ClientInfo } from '../graphql/client.js';
import { User, type UserDoc } from '../models/User.js';

const INTERVAL_MS = 5 * 60_000;

/**
 * Remember when a user last used the app and from which build (portal → Users).
 * Only app requests count (they send X-App-Platform); written at most every 5 minutes.
 */
export function touchUser(user: UserDoc, client: ClientInfo): void {
  if (!client.platform || user.$locals.touched) return;
  user.$locals.touched = true;
  const recent = user.lastSeenAt && Date.now() - user.lastSeenAt.getTime() < INTERVAL_MS;
  if (recent && user.appVersion === client.appVersion) return;
  User.updateOne({ _id: user._id }, { $set: { lastSeenAt: new Date(), appVersion: client.appVersion, platform: client.platform } }).catch(
    (err: unknown) => console.error('Could not record user activity', err),
  );
}
