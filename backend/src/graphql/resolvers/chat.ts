import { CHAT_SUGGESTIONS, chatHistory, chooseOption, clearChat, sendMessage } from '../../services/chat/index.js';
import { validate } from '../../utils/errors.js';
import { zObjectId } from '../../utils/validators.js';
import type { Context } from '../context.js';

export const chatResolvers = {
  Query: {
    chatHistory: async (_: unknown, args: { limit?: number | null; before?: Date | null }, ctx: Context) =>
      chatHistory(await ctx.user(), args.limit ?? 50, args.before),
    chatSuggestions: () => CHAT_SUGGESTIONS,
  },
  Mutation: {
    sendChatMessage: async (_: unknown, { text }: { text: string }, ctx: Context) => sendMessage(await ctx.user(), text),
    chooseChatOption: async (_: unknown, args: { messageId: string; optionId: string }, ctx: Context) =>
      chooseOption(await ctx.user(), validate(zObjectId, args.messageId), args.optionId),
    clearChat: async (_: unknown, __: unknown, ctx: Context) => clearChat(await ctx.user()),
  },
};
