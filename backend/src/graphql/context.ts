import { GraphQLError } from 'graphql';
import type { YogaInitialContext } from 'graphql-yoga';
import { User, type UserDoc } from '../models/User.js';
import { readToken } from '../services/auth.js';
import { unauthenticated } from '../utils/errors.js';

export interface Context {
  userId: string | null;
  /** Loads the authenticated user once per request, throws when logged out */
  user(): Promise<UserDoc>;
  admin(): Promise<UserDoc>;
}

export function createContext({ request }: YogaInitialContext): Context {
  const userId = readToken(request.headers.get('authorization'));
  let cached: Promise<UserDoc | null> | null = null;
  // exec() gives a real Promise; a raw mongoose Query can't be awaited twice
  const load = () => (cached ??= userId ? User.findById(userId).exec() : Promise.resolve(null));
  return {
    userId,
    async user() {
      const u = await load();
      if (!u) throw unauthenticated();
      return u;
    },
    async admin() {
      const u = await load();
      if (!u) throw unauthenticated();
      if (u.role !== 'ADMIN') throw new GraphQLError('Only admins can change environment settings', { extensions: { code: 'FORBIDDEN' } });
      return u;
    },
  };
}
