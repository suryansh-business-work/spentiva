import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { Types } from 'mongoose';
import { env } from '../config/env.js';
import { AppSetting } from '../models/AppSetting.js';
import { badInput } from '../utils/errors.js';

export const SETTING_DEFS = {
  OPENAI_API_KEY: { label: 'OpenAI API key', group: 'OpenAI', secret: true },
  OPENAI_MODEL: { label: 'OpenAI model', group: 'OpenAI', secret: false },
  SLACK_BOT_TOKEN: { label: 'Slack bot token', group: 'Slack', secret: true },
  SLACK_CHANNEL_ID: { label: 'Slack channel', group: 'Slack', secret: false },
  SLACK_CHANNEL_NAME: { label: 'Slack channel name', group: 'Slack', secret: false },
} as const;

export type SettingKey = keyof typeof SETTING_DEFS;
export const isSettingKey = (k: string): k is SettingKey => k in SETTING_DEFS;

const envFallback: Partial<Record<SettingKey, string | undefined>> = {
  OPENAI_API_KEY: env.OPENAI_API_KEY,
  OPENAI_MODEL: env.OPENAI_MODEL,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
};

const KEY = createHash('sha256')
  .update(process.env.SETTINGS_SECRET || env.JWT_SECRET)
  .digest();

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return `v1:${Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64')}`;
}

function decrypt(stored: string): string | null {
  if (!stored.startsWith('v1:')) return stored;
  try {
    const raw = Buffer.from(stored.slice(3), 'base64');
    const decipher = createDecipheriv('aes-256-gcm', KEY, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
  } catch {
    return null; // encryption secret changed → treat as unset
  }
}

let cache: { at: number; values: Map<string, string> } | null = null;

async function load(): Promise<Map<string, string>> {
  if (cache && Date.now() - cache.at < 30_000) return cache.values;
  const rows = await AppSetting.find({}, { key: 1, value: 1 }).lean();
  const values = new Map<string, string>();
  for (const r of rows) {
    const v = decrypt(r.value);
    if (v) values.set(r.key, v);
  }
  cache = { at: Date.now(), values };
  return values;
}

/** App setting value, falling back to the server environment variable */
export async function getSetting(key: SettingKey): Promise<string | null> {
  const values = await load();
  return values.get(key) || envFallback[key] || null;
}

export async function setSettings(updates: { key: string; value?: string | null }[], userId: Types.ObjectId) {
  for (const { key, value } of updates) {
    if (!isSettingKey(key)) throw badInput(`Unknown setting ${key}`);
    const v = value?.trim();
    if (!v) {
      await AppSetting.deleteOne({ key });
      continue;
    }
    const stored = SETTING_DEFS[key].secret ? encrypt(v) : v;
    await AppSetting.updateOne({ key }, { $set: { value: stored, updatedBy: userId } }, { upsert: true });
  }
  cache = null;
}

const mask = (v: string) => (v.length <= 8 ? '••••' : `${v.slice(0, 4)}…${v.slice(-4)}`);

export async function listSettings() {
  const values = await load();
  return (Object.keys(SETTING_DEFS) as SettingKey[]).map((key) => {
    const def = SETTING_DEFS[key];
    const appValue = values.get(key);
    const value = appValue || envFallback[key] || null;
    return {
      key,
      label: def.label,
      group: def.group,
      secret: def.secret,
      isSet: Boolean(value),
      value: value ? (def.secret ? mask(value) : value) : null,
      source: appValue ? 'APP' : value ? 'SERVER_ENV' : 'NONE',
    };
  });
}
