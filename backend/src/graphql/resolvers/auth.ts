import { User } from '../../models/User.js';
import { hashPassword, signToken, verifyPassword } from '../../services/auth.js';
import { seedUserDefaults } from '../../services/seed.js';
import { rebaseTransactions } from '../../services/transactions.js';
import { badInput, validate } from '../../utils/errors.js';
import type { Context } from '../context.js';
import { LoginZ, PasswordZ, ProfileZ, SignupZ } from '../inputs.js';
import { toUser } from '../mappers.js';

const adminEmails = () =>
  new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );

type Input = { input: unknown };

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => (ctx.userId ? toUser(await ctx.user()) : null),
  },
  Mutation: {
    signup: async (_: unknown, { input }: Input) => {
      const data = validate(SignupZ, input);
      if (await User.exists({ email: data.email })) throw badInput('An account with this email already exists');
      const isFirst = (await User.estimatedDocumentCount()) === 0;
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: await hashPassword(data.password),
        currency: data.currency ?? 'INR',
        timezone: data.timezone ?? 'UTC',
        locale: data.locale ?? 'en-IN',
        role: isFirst || adminEmails().has(data.email) ? 'ADMIN' : 'USER',
      });
      await seedUserDefaults(user._id);
      return { token: signToken(user.id), user: toUser(user) };
    },

    login: async (_: unknown, { input }: Input) => {
      const data = validate(LoginZ, input);
      const user = await User.findOne({ email: data.email });
      if (!user || !(await verifyPassword(data.password, user.passwordHash))) throw badInput('Incorrect email or password');
      if (user.disabled) throw badInput('This account has been disabled. Please contact support.');
      if (user.role !== 'ADMIN' && adminEmails().has(user.email)) {
        user.role = 'ADMIN';
        await user.save();
      }
      return { token: signToken(user.id), user: toUser(user) };
    },

    updateProfile: async (_: unknown, { input }: Input, ctx: Context) => {
      const user = await ctx.user();
      const data = validate(ProfileZ, input);
      const currencyChanged = data.currency && data.currency !== user.currency;
      user.set({
        ...(data.name && { name: data.name }),
        ...(data.currency && { currency: data.currency }),
        ...(data.timezone && { timezone: data.timezone }),
        ...(data.locale && { locale: data.locale }),
        ...(data.monthlyBudget !== undefined && { monthlyBudget: data.monthlyBudget }),
      });
      if (currencyChanged) await rebaseTransactions(user._id, user.currency);
      await user.save();
      return toUser(user);
    },

    changePassword: async (_: unknown, args: { current: string; next: string }, ctx: Context) => {
      const user = await ctx.user();
      if (!(await verifyPassword(args.current, user.passwordHash))) throw badInput('Current password is incorrect');
      user.passwordHash = await hashPassword(validate(PasswordZ, args.next));
      await user.save();
      return true;
    },
  },
};
