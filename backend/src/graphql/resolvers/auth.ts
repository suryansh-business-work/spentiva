import { User } from '../../models/User.js';
import { hashPassword, signToken, verifyPassword } from '../../services/auth.js';
import { createTracker, defaultTracker } from '../../services/trackers/index.js';
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
      await createTracker(user, { name: 'Home', kind: 'PERSONAL', currency: user.currency });
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
      user.set({
        ...(data.name && { name: data.name }),
        ...(data.currency && { currency: data.currency }),
        ...(data.timezone && { timezone: data.timezone }),
        ...(data.locale && { locale: data.locale }),
      });
      await user.save();
      // Deprecated input from app builds before trackers: the budget now lives on the default tracker
      if (data.monthlyBudget !== undefined) await (await defaultTracker(user._id)).updateOne({ monthlyBudget: data.monthlyBudget });
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
