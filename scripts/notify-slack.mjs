#!/usr/bin/env node
/**
 * Posts new builds to Slack (uploads the APK/AAB/IPA files to the channel).
 *
 *   node scripts/notify-slack.mjs <dir>
 *
 * Slack token + channel resolution (first match wins):
 *   1. The app's Settings → Environment (read from the API: GET <API>/ci/config with CI_TOKEN)
 *   2. GitHub Actions secrets SLACK_BOT_TOKEN + SLACK_CHANNEL_ID
 *
 * Other env: API_URL, CI_TOKEN, VERSION, CHANNEL, TAG, DRIVE_URL, RELEASE_URL, GITHUB_* (set by Actions)
 * Bot scopes: chat:write, files:write (and the bot must be in the channel).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const dir = process.argv[2];
const env = process.env;

async function configFromApp() {
  if (!env.API_URL || !env.CI_TOKEN) return null;
  try {
    const base = env.API_URL.replace(/\/graphql\/?$/, '');
    const res = await fetch(`${base}/ci/config`, {
      headers: { Authorization: `Bearer ${env.CI_TOKEN}` },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { slack } = await res.json();
    if (slack?.token && slack?.channelId) {
      console.log(`Using Slack settings from the app (#${slack.channelName ?? slack.channelId})`);
      return { token: slack.token, channel: slack.channelId };
    }
  } catch (err) {
    console.log(`Could not read Slack settings from the app (${err.message}); falling back to secrets`);
  }
  return null;
}

async function slack(token, method, body, form = false) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8',
    },
    body: form ? new URLSearchParams(body) : JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.error}`);
  return json;
}

async function uploadFiles(token, channel, files, comment) {
  const uploaded = [];
  for (const file of files) {
    const size = statSync(file).size;
    const { upload_url, file_id } = await slack(token, 'files.getUploadURLExternal', { filename: basename(file), length: String(size) }, true);
    const res = await fetch(upload_url, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: readFileSync(file) });
    if (!res.ok) throw new Error(`upload ${basename(file)} → HTTP ${res.status}`);
    uploaded.push({ id: file_id, title: basename(file) });
    console.log(`Uploaded ${basename(file)} (${(size / 1024 / 1024).toFixed(1)} MB)`);
  }
  await slack(token, 'files.completeUploadExternal', { files: JSON.stringify(uploaded), channel_id: channel, initial_comment: comment }, true);
}

const cfg =
  (await configFromApp()) ?? (env.SLACK_BOT_TOKEN && env.SLACK_CHANNEL_ID ? { token: env.SLACK_BOT_TOKEN, channel: env.SLACK_CHANNEL_ID } : null);
if (!cfg) {
  console.log('Slack notification skipped: no Slack token/channel in the app settings or GitHub secrets');
  process.exit(0);
}

const files = dir
  ? readdirSync(dir)
      .filter((f) => /\.(apk|aab|ipa)$/i.test(f))
      .map((f) => join(dir, f))
  : [];
const repo = env.GITHUB_REPOSITORY ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}` : null;
const sha = env.GITHUB_SHA?.slice(0, 7);
const lines = [
  `:rocket: *Spentiva ${env.VERSION ? `v${env.VERSION}` : ''}* (${env.CHANNEL ?? 'build'}) is ready`,
  sha && repo ? `Commit <${repo}/commit/${env.GITHUB_SHA}|${sha}> on \`${env.GITHUB_REF_NAME}\`` : null,
  env.RELEASE_URL ? `:package: <${env.RELEASE_URL}|GitHub release>` : null,
  env.DRIVE_URL ? `:file_folder: <${env.DRIVE_URL}|Google Drive folder>` : null,
  repo && env.VERSION ? `:open_file_folder: <${repo}/tree/${env.GITHUB_REF_NAME}/builds/${env.CHANNEL}/v${env.VERSION}|Repo builds folder>` : null,
  repo && env.GITHUB_RUN_ID ? `:gear: <${repo}/actions/runs/${env.GITHUB_RUN_ID}|Workflow run>` : null,
].filter(Boolean);
const comment = lines.join('\n');

try {
  if (!files.length) throw new Error('no files');
  await uploadFiles(cfg.token, cfg.channel, files, comment);
  console.log('Slack: files posted');
} catch (err) {
  console.log(`Slack file upload failed (${err.message}); posting links only`);
  try {
    await slack(cfg.token, 'chat.postMessage', { channel: cfg.channel, text: comment, unfurl_links: false });
    console.log('Slack: message posted');
  } catch (e) {
    console.log(`::warning::Slack notification failed: ${e.message}`);
  }
}
