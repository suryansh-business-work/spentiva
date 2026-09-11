import { GraphQLError } from 'graphql';
import { RULES } from '../../config/rules.js';
import { CURRENCIES, TIME_ZONES } from '../../services/reference.js';
import { recordServerError } from '../../services/logs.js';
import type { Context } from '../context.js';
import { DateTime } from '../scalars.js';
import { adminResolvers } from './admin.js';
import { authResolvers } from './auth.js';
import { catalogResolvers } from './catalog.js';
import { chatResolvers } from './chat.js';
import { logResolvers } from './logs.js';
import { moneyResolvers } from './money.js';
import { supportResolvers } from './support.js';
import { trackerResolvers } from './trackers.js';
import { userResolvers } from './users.js';

const referenceResolvers = {
  Query: {
    currencies: () => CURRENCIES,
    timeZones: () => TIME_ZONES,
    validationRules: () => RULES,
  },
};

const modules = [
  authResolvers,
  catalogResolvers,
  moneyResolvers,
  chatResolvers,
  adminResolvers,
  referenceResolvers,
  logResolvers,
  supportResolvers,
  trackerResolvers,
  userResolvers,
];

type Resolver = (parent: unknown, args: never, ctx: Context, info: unknown) => unknown;

/** Unexpected failures (anything that isn't a GraphQLError) land in Logs with the operation and the caller */
function logged(kind: 'Query' | 'Mutation', resolvers: Record<string, Resolver>): Record<string, Resolver> {
  return Object.fromEntries(
    Object.entries(resolvers).map(([name, resolve]) => [
      name,
      async (parent: unknown, args: never, ctx: Context, info: unknown) => {
        try {
          return await resolve(parent, args, ctx, info);
        } catch (err) {
          if (!(err instanceof GraphQLError)) recordServerError(err, `${kind}.${name}`, ctx.userId, ctx.client);
          throw err;
        }
      },
    ]),
  );
}

export const resolvers = {
  DateTime,
  Query: logged('Query', Object.assign({}, ...modules.map((m) => m.Query))),
  Mutation: logged('Mutation', Object.assign({}, ...modules.map((m) => ('Mutation' in m ? m.Mutation : {})))),
};
