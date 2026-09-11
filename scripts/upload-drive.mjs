#!/usr/bin/env node
/**
 * Uploads build files to Google Drive (zero dependencies).
 *
 *   node scripts/upload-drive.mjs <dir> <sub/folder/path>
 *
 * Env (GitHub Actions secrets):
 *   GDRIVE_FOLDER_ID                                   – target folder (id from the folder URL)
 *   GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN – OAuth client + refresh token
 *   GDRIVE_SHARE_ANYONE=true         – optional: make the version folder viewable by link
 *
 * Prints the folder link and writes `drive_url` to $GITHUB_OUTPUT.
 */
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const [dir, subPath = ''] = process.argv.slice(2);
const env = process.env;
const API = 'https://www.googleapis.com/drive/v3';
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const MIME = { apk: 'application/vnd.android.package-archive', aab: 'application/octet-stream', ipa: 'application/octet-stream' };

function skip(reason) {
  console.log(`Google Drive upload skipped: ${reason}`);
  process.exit(0);
}

/** OAuth refresh-token flow (works for personal Gmail and Workspace accounts) */
async function accessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GDRIVE_CLIENT_ID,
      client_secret: env.GDRIVE_CLIENT_SECRET,
      refresh_token: env.GDRIVE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`OAuth token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function drive(token, url, init = {}) {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`Drive ${init.method || 'GET'} ${url} → ${res.status} ${await res.text()}`);
  return res;
}

async function ensureFolder(token, parentId, name) {
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and trashed=false`;
  const list = await (
    await drive(token, `${API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`)
  ).json();
  if (list.files?.[0]) return list.files[0].id;
  const created = await (
    await drive(token, `${API}/files?supportsAllDrives=true&fields=id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }),
    })
  ).json();
  return created.id;
}

async function uploadFile(token, folderId, file) {
  const size = statSync(file).size;
  const ext = file.split('.').pop().toLowerCase();
  const init = await drive(token, `${UPLOAD}/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': MIME[ext] || 'application/octet-stream',
      'X-Upload-Content-Length': String(size),
    },
    body: JSON.stringify({ name: basename(file), parents: [folderId] }),
  });
  const location = init.headers.get('location');
  if (!location) throw new Error('Drive did not return an upload URL');
  const res = await fetch(location, {
    method: 'PUT',
    headers: { 'Content-Length': String(size), 'Content-Type': MIME[ext] || 'application/octet-stream' },
    body: readFileSync(file),
  });
  if (!res.ok) throw new Error(`Upload of ${basename(file)} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

if (!dir) skip('no directory given');
if (!env.GDRIVE_FOLDER_ID) skip('GDRIVE_FOLDER_ID secret is not set');
const files = readdirSync(dir)
  .filter((f) => /\.(apk|aab|ipa)$/i.test(f))
  .map((f) => join(dir, f));
if (!files.length) skip(`no build files in ${dir}`);

if (!env.GDRIVE_CLIENT_ID || !env.GDRIVE_CLIENT_SECRET || !env.GDRIVE_REFRESH_TOKEN)
  skip('GDRIVE_CLIENT_ID / GDRIVE_CLIENT_SECRET / GDRIVE_REFRESH_TOKEN secrets are not set');
const token = await accessToken();

let folderId = env.GDRIVE_FOLDER_ID;
for (const part of subPath.split('/').filter(Boolean)) folderId = await ensureFolder(token, folderId, part);

for (const file of files) {
  const up = await uploadFile(token, folderId, file);
  console.log(`Uploaded ${up.name} → ${up.webViewLink ?? up.id}`);
}

if (env.GDRIVE_SHARE_ANYONE === 'true') {
  await drive(token, `${API}/files/${folderId}/permissions?supportsAllDrives=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
}

const url = `https://drive.google.com/drive/folders/${folderId}`;
console.log(`Drive folder: ${url}`);
if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `drive_url=${url}\n`);
