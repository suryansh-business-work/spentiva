import { User, type UserDoc } from '../../models/User.js';
import { adminStats } from '../../services/stats.js';
import { deleteUser, resetPassword, updateUser, userCounts, userQuery } from '../../services/users.js';
import { validate } from '../../utils/errors.js';
import { paging } from '../../utils/paging.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';
import { PageZ, PasswordZ, UserFilterZ, UserUpdateZ } from '../inputs.js';
import { toAdminUser } from '../mappers.js';

const USER_SORT = ['createdAt', 'lastSeenAt', 'name', 'email'] as const;

async function withCounts(users: UserDoc[]) {
  const counts = await userCounts(users.map((u) => u._id));
  return users.map((u) => toAdminUser(u, counts));
}

const one = async (user: UserDoc) => (await withCounts([user]))[0];

/** Portal: dashboard numbers and user management (admins only) */
export const userResolvers = {
  Query: {
    adminStats: async (_: unknown, __: unknown, ctx: Context) => adminStats((await ctx.admin()).timezone),
    adminUsers: async (_: unknown, args: { filter?: unknown; page?: unknown }, ctx: Context) => {
      await ctx.admin();
      const q = userQuery(validate(UserFilterZ, args.filter ?? {}));
      const p = paging(validate(PageZ, args.page ?? {}), USER_SORT, 'createdAt');
      const [items, total] = await Promise.all([User.find(q).sort(p.sort).skip(p.skip).limit(p.limit), User.countDocuments(q)]);
      return { items: await withCounts(items), total };
    },
    adminUser: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      await ctx.admin();
      const user = await User.findById(validate(zObjectId, id));
      return user ? one(user) : null;
    },
  },
  Mutation: {
    adminUpdateUser: async (_: unknown, args: { id: string; input: unknown }, ctx: Context) => {
      const admin = await ctx.admin();
      return one(await updateUser(admin, validate(zObjectId, args.id), validate(UserUpdateZ, args.input)));
    },
    adminResetPassword: async (_: unknown, args: { id: string; password: string }, ctx: Context) => {
      await ctx.admin();
      return resetPassword(validate(zObjectId, args.id), validate(PasswordZ, args.password));
    },
    adminDeleteUser: async (_: unknown, { id }: { id: string }, ctx: Context) => deleteUser(await ctx.admin(), validate(zObjectId, id)),
  },
};
