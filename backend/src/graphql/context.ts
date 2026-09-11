import type { YogaInitialContext } from 'graphql-yoga';
import { User, type UserDoc } from '../models/User.js';
import { readToken } from '../services/auth.js';
import { touchUser } from '../services/presence.js';
import { forbidden, unauthenticated } from '../utils/errors.js';
import { readClient, type ClientInfo } from './client.js';

export interface Context {
  userId: string | null;
  client: ClientInfo;
  /** Loads the authenticated user once per request, throws when logged out or disabled */
  user(): Promise<UserDoc>;
  admin(): Promise<UserDoc>;
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
  };
}
