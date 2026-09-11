import { CHAT_SUGGESTIONS, chatHistory, chooseOption, clearChat, sendMessage } from '../../services/chat/index.js';
import { validate } from '../../utils/errors.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';

type TrackerArgs = { trackerId?: string | null };

export const chatResolvers = {
  Query: {
    chatHistory: async (_: unknown, args: TrackerArgs & { limit?: number | null; before?: Date | null }, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      return chatHistory(user, tracker, args.limit ?? 50, args.before);
    },
    chatSuggestions: () => CHAT_SUGGESTIONS,
  },
  Mutation: {
    sendChatMessage: async (_: unknown, args: TrackerArgs & { text: string }, ctx: Context) => {
      const { user, tracker, role } = await ctx.tracker(args.trackerId, 'VIEW');
      return sendMessage(user, tracker, role, args.text);
    },
    chooseChatOption: async (_: unknown, args: { messageId: string; optionId: string }, ctx: Context) =>
      chooseOption(await ctx.user(), validate(zObjectId, args.messageId), args.optionId),
    clearChat: async (_: unknown, args: TrackerArgs, ctx: Context) => {
      const { user, tracker } = await ctx.tracker(args.trackerId, 'VIEW');
      return clearChat(user, tracker);
    },
  },
};
