#!/usr/bin/env node
/**
 * One-command setup of GitHub Actions secrets/variables with the GitHub CLI (`gh auth login` first).
 *
 *   node scripts/setup-secrets.mjs                 # repository-level (default for all branches)
 *   node scripts/setup-secrets.mjs --env staging   # override for the staging environment
 *   node scripts/setup-secrets.mjs --env production
 *
 * Press Enter to skip a value. JWT_SECRET, CI_TOKEN and SETTINGS_SECRET are generated when left
 * empty (they're printed once so you can reuse them on a host that isn't deployed by Actions).
 */
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';

const envIdx = process.argv.indexOf('--env');
const environment = envIdx > -1 ? process.argv[envIdx + 1] : null;
const repoIdx = process.argv.indexOf('--repo');
const repo = repoIdx > -1 ? process.argv[repoIdx + 1] : null;

const SECRETS = [
  ['API_URL', 'Public GraphQL URL the app uses, e.g. https://api.example.com/graphql'],
  ['MONGODB_URI', 'MongoDB Atlas connection string'],
  ['JWT_SECRET', 'JWT signing secret (auto-generated if empty)', 'generate'],
  ['OPENAI_API_KEY', 'OpenAI API key (sk-…)'],
  ['OPENAI_MODEL', 'OpenAI model (default gpt-4o)'],
  ['SLACK_BOT_TOKEN', 'Slack bot token (xoxb-…) – builds are posted here'],
  ['SLACK_CHANNEL_ID', 'Slack channel ID (e.g. C0123ABCD) – can also be picked in the app'],
  ['SMTP_HOST', 'SMTP server for email reports, e.g. smtp.gmail.com (optional, can be set in the portal)'],
  ['SMTP_PORT', 'SMTP port (465 = TLS, 587 = STARTTLS)'],
  ['SMTP_USER', 'SMTP username'],
  ['SMTP_PASSWORD', 'SMTP password / app password'],
  ['SMTP_FROM', 'From address, e.g. Spentiva <reports@example.com>'],
  ['CI_TOKEN', 'Shared secret between CI and API for /ci/config (auto-generated if empty)', 'generate'],
  ['SETTINGS_SECRET', 'Encryption key for secrets saved in the app (auto-generated if empty)', 'generate'],
  ['GDRIVE_FOLDER_ID', 'Google Drive folder ID for builds'],
  ['GDRIVE_CLIENT_ID', 'Google OAuth client ID (Drive upload)'],
  ['GDRIVE_CLIENT_SECRET', 'Google OAuth client secret'],
  ['GDRIVE_REFRESH_TOKEN', 'Google OAuth refresh token (scope: drive)'],
  ['ANDROID_KEYSTORE_BASE64', 'Path to your upload keystore .jks (optional)', 'file-base64'],
  ['ANDROID_KEYSTORE_PASSWORD', 'Keystore password'],
  ['ANDROID_KEY_ALIAS', 'Key alias'],
  ['ANDROID_KEY_PASSWORD', 'Key password (defaults to keystore password)'],
  ['IOS_P12_BASE64', 'Path to iOS distribution certificate .p12 (optional)', 'file-base64'],
  ['IOS_P12_PASSWORD', 'Password of the .p12'],
  ['IOS_PROVISION_PROFILE_BASE64', 'Path to .mobileprovision (optional)', 'file-base64'],
  ['SSH_HOST', 'VPS host for the backend (Docker over SSH)'],
  ['SSH_USER', 'VPS user'],
  ['SSH_PRIVATE_KEY', 'Path to the SSH private key file', 'file'],
];

function gh(args, input) {
  const res = spawnSync('gh', [...args, ...(repo ? ['--repo', repo] : []), ...(environment ? ['--env', environment] : [])], {
    input,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (res.status !== 0) throw new Error(res.stderr || `gh ${args.join(' ')} failed`);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log(`Setting GitHub Actions secrets${environment ? ` for environment "${environment}"` : ' (repository level)'} – Enter to skip.\n`);
const generated = [];
for (const [name, help, mode] of SECRETS) {
  let value = (await rl.question(`${name} – ${help}\n> `)).trim();
  if (!value && mode === 'generate') {
    value = randomBytes(32).toString('hex');
    generated.push([name, value]);
  }
  if (!value) continue;
  if (mode === 'file' || mode === 'file-base64') {
    if (!existsSync(value)) {
      console.log(`  ! file not found: ${value} (skipped)`);
      continue;
    }
    value = mode === 'file' ? readFileSync(value, 'utf8') : readFileSync(value).toString('base64');
  }
  try {
    gh(['secret', 'set', name], value);
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.log(`  ✗ ${name}: ${err.message.trim()}`);
  }
}
rl.close();

if (generated.length) {
  console.log('\nGenerated values (store them safely if your backend is hosted outside GitHub Actions):');
  for (const [k, v] of generated) console.log(`  ${k}=${v}`);
}
console.log('\nOptional repository variables: ENABLE_IOS_BUILD=false, IOS_BUNDLE_ID, API_PORT, ADMIN_EMAILS, CORS_ORIGIN, GDRIVE_SHARE_ANYONE=true');
console.log('  gh variable set ENABLE_IOS_BUILD --body false');
