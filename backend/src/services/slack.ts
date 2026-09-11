import { badInput } from '../utils/errors.js';

interface SlackResponse {
  ok: boolean;
  error?: string;
  channels?: { id: string; name: string; is_private: boolean; is_member: boolean }[];
  response_metadata?: { next_cursor?: string };
}

async function slack(token: string, method: string, params: Record<string, string> = {}, body?: object) {
  const url = new URL(`https://slack.com/api/${method}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });
  const json = (await res.json()) as SlackResponse;
  const reason = json.error ?? `HTTP ${res.status}`;
  if (!json.ok) throw badInput(`Slack: ${reason}`);
  return json;
}

/** Channels visible to the bot (needs channels:read, and groups:read for private channels) */
export async function listSlackChannels(token: string) {
  const out: { id: string; name: string; isPrivate: boolean; isMember: boolean }[] = [];
  let cursor = '';
  for (let page = 0; page < 10; page++) {
    const json = await slack(token, 'conversations.list', {
      types: 'public_channel,private_channel',
      exclude_archived: 'true',
      limit: '200',
      ...(cursor ? { cursor } : {}),
    }).catch(async (err: Error) => {
      // Tokens without groups:read can still list public channels
      if (err.message.includes('missing_scope')) {
        return slack(token, 'conversations.list', { types: 'public_channel', exclude_archived: 'true', limit: '200' });
      }
      throw err;
    });
    for (const c of json.channels ?? []) out.push({ id: c.id, name: c.name, isPrivate: c.is_private, isMember: c.is_member });
    cursor = json.response_metadata?.next_cursor ?? '';
    if (!cursor) break;
  }
  return out.toSorted((a, b) => Number(b.isMember) - Number(a.isMember) || a.name.localeCompare(b.name));
}

export async function postSlackMessage(token: string, channel: string, text: string) {
  await slack(token, 'chat.postMessage', {}, { channel, text });
}
