#!/usr/bin/env node
/**
 * Computes the next semantic version for a release channel from Conventional Commits.
 *
 *   node scripts/version.mjs --channel staging|production [--bump auto|patch|minor|major]
 *
 * Rules
 *  - Source of truth: mobile/package.json "version".
 *  - staging: next = bump(last staging tag) using commits since that tag
 *      BREAKING CHANGE / "type!:" → major, "feat:" → minor, anything else → patch.
 *    First ever release uses package.json as-is. A manual bump in package.json wins if higher.
 *  - production (main): releases the version merged from staging. If that version was already
 *    released to production (hotfix pushed straight to main) it is bumped the same way.
 *
 * Writes `version`, `version_code`, `tag`, `channel`, `bump`, `changelog` to $GITHUB_OUTPUT when present.
 */
import { execSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => (cur.startsWith('--') ? [...acc, [cur.slice(2), arr[i + 1]]] : acc), []),
);
const channel = args.channel === 'production' ? 'production' : 'staging';
const forced = ['patch', 'minor', 'major'].includes(args.bump) ? args.bump : null;

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
};
const parse = (v) => {
  const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(v ?? '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};
const fmt = (p) => p.join('.');
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const inc = (p, kind) => (kind === 'major' ? [p[0] + 1, 0, 0] : kind === 'minor' ? [p[0], p[1] + 1, 0] : [p[0], p[1], p[2] + 1]);

function bumpFrom(range) {
  if (forced) return forced;
  const log = sh(`git log ${range} --no-merges --format=%s%n%b%n==END==`);
  if (/BREAKING[ -]CHANGE|^\w+(\([^)]*\))?!:/m.test(log)) return 'major';
  if (/^feat(\([^)]*\))?:/m.test(log)) return 'minor';
  return 'patch';
}

function changelog(range) {
  return sh(`git log ${range} --no-merges --format=- %s (%h)`)
    .split('\n')
    .filter((l) => l && !/\[skip ci\]|chore\(release\)/.test(l))
    .slice(0, 30)
    .join('\n');
}

const pkg = JSON.parse(readFileSync(join(root, 'mobile', 'package.json'), 'utf8'));
const current = parse(pkg.version) ?? [1, 0, 0];

let next;
let bump = 'none';
let range = 'HEAD~20..HEAD';

if (channel === 'staging') {
  const lastTag = sh(`git describe --tags --abbrev=0 --match "v*-staging"`);
  const last = parse(lastTag);
  if (!last) {
    next = current;
  } else {
    range = `${lastTag}..HEAD`;
    if (cmp(current, last) > 0) next = current;
    else {
      bump = bumpFrom(range);
      next = inc(last, bump);
    }
  }
} else {
  const tag = `v${fmt(current)}`;
  const alreadyReleased = sh(`git tag --list "${tag}"`) === tag;
  const lastProd = sh(`git describe --tags --abbrev=0 --match "v[0-9]*.[0-9]*.[0-9]" --exclude "*-*"`);
  if (lastProd) range = `${lastProd}..HEAD`;
  if (alreadyReleased) {
    range = `${tag}..HEAD`;
    bump = bumpFrom(range);
    next = inc(current, bump);
  } else next = current;
}

const version = fmt(next);
const versionCode = next[0] * 1_000_000 + next[1] * 1_000 + next[2];
const tag = channel === 'staging' ? `v${version}-staging` : `v${version}`;
const notes = changelog(range);

const out = { version, version_code: String(versionCode), tag, channel, bump, previous: pkg.version };
console.log(JSON.stringify(out, null, 2));
if (notes) console.log(`\nChanges:\n${notes}`);

if (process.env.GITHUB_OUTPUT) {
  const lines = Object.entries(out).map(([k, v]) => `${k}=${v}`);
  lines.push(`changelog<<__CHANGELOG__\n${notes || '- Maintenance release'}\n__CHANGELOG__`);
  appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
}
