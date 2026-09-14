import type { YogaInitialContext } from 'graphql-yoga';
import type { TrackerDoc, TrackerRole } from '../models/Tracker.js';
import { User, type UserDoc } from '../models/User.js';
import { readToken } from '../services/auth.js';
import { touchUser } from '../services/presence.js';
import { loadTracker, type Need } from '../services/trackers/access.js';
import { forbidden, unauthenticated } from '../utils/errors.js';
import { readClient, type ClientInfo } from './client.js';

export interface TrackerAccess {
  user: UserDoc;
  tracker: TrackerDoc;
  role: TrackerRole;
}

export interface Context {
  userId: string | null;
  client: ClientInfo;
  /** Loads the authenticated user once per request, throws when logged out or disabled */
  user(): Promise<UserDoc>;
  admin(): Promise<UserDoc>;
  /** The user plus a tracker they may use with at least `need` rights (no id = their default tracker) */
  tracker(trackerId: string | null | undefined, need: Need): Promise<TrackerAccess>;
}

export function createContext({ request }: YogaInitialContext): Context {
  const userId = readToken(request.headers.get('authorization'));
  const client = readClient(request.headers);
  let cached: Promise<UserDoc | null> | null = null;
  // exec() gives a real Promise; a raw mongoose Query can't be awaited twice
  const load = () => (cached ??= userId ? User.findById(userId).exec() : Promise.resolve(null));

  const user = async () => {
    const u = await load();
    if (!u) throw unauthenticated();
    if (u.disabled) throw unauthenticated('This account has been disabled. Please contact support.');
    touchUser(u, client);
    return u;
  };

  return {
    userId,
    client,
    user,
    async admin() {
      const u = await user();
      if (u.role !== 'ADMIN') throw forbidden('This needs an admin account');
      return u;
    },
    async tracker(trackerId, need) {
      const u = await user();
      return { user: u, ...(await loadTracker(u, trackerId, need)) };
    },
  };
}
