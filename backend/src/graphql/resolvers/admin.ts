import { listOpenAiModels, testOpenAi } from '../../services/ai.js';
import { getSetting, listSettings, setSettings } from '../../services/appSettings.js';
import { listSlackChannels, postSlackMessage } from '../../services/slack.js';
import { badInput, validate } from '../../utils/errors.js';
import type { Context } from '../context.js';
import { EnvVarsZ } from '../inputs.js';

async function slackToken() {
  const token = await getSetting('SLACK_BOT_TOKEN');
  if (!token) throw badInput('Save a Slack bot token first');
  return token;
}

/** App-wide environment settings (OpenAI, Slack) – admins only */
export const adminResolvers = {
  Query: {
    envVars: async (_: unknown, __: unknown, ctx: Context) => {
      await ctx.admin();
      return listSettings();
    },
    slackChannels: async (_: unknown, __: unknown, ctx: Context) => {
      await ctx.admin();
      return listSlackChannels(await slackToken());
    },
    openAiModels: async (_: unknown, __: unknown, ctx: Context) => {
      await ctx.admin();
      return listOpenAiModels();
    },
  },
  Mutation: {
    setEnvVars: async (_: unknown, { input }: { input: unknown }, ctx: Context) => {
      const admin = await ctx.admin();
      await setSettings(validate(EnvVarsZ, input), admin._id);
      return listSettings();
    },
    testSlack: async (_: unknown, __: unknown, ctx: Context) => {
      const admin = await ctx.admin();
      const channel = await getSetting('SLACK_CHANNEL_ID');
      if (!channel) throw badInput('Pick a Slack channel first');
      await postSlackMessage(
        await slackToken(),
        channel,
        `:white_check_mark: Spentiva is connected. New app builds will be posted here. (tested by ${admin.name})`,
      );
      return true;
    },
    testOpenAi: async (_: unknown, __: unknown, ctx: Context) => {
      await ctx.admin();
      return testOpenAi();
    },
  },
};
