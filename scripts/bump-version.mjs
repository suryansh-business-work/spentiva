#!/usr/bin/env node
/**
 * One version for the whole repo. mobile/package.json is the source of truth; every other
 * package mirrors it (package.json + package-lock.json), so the app, API and portal always
 * report the same number.
 *
 *   node scripts/bump-version.mjs --needed        exit 0 when the next push still needs a bump
 *   node scripts/bump-version.mjs --bump minor    bump every package and stage the files (pre-commit hook)
 *   node scripts/bump-version.mjs --set 1.4.0     set every package to a version (release bot)
 *
 * "Needed" = HEAD's version is not ahead of the upstream branch yet, i.e. nothing pushed
 * since the last push has bumped it. So each push carries exactly one bump.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = ['mobile', 'backend', 'portal'].filter((dir) => existsSync(join(root, dir, 'package.json')));
const KINDS = new Set(['patch', 'minor', 'major']);

const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

const parse = (v) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v ?? '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const inc = ([major, minor, patch], kind) => {
  if (kind === 'major') return [major + 1, 0, 0];
  if (kind === 'minor') return [major, minor + 1, 0];
  return [major, minor, patch + 1];
};

/** mobile/package.json version at a git revision ("" = working tree) */
function versionAt(rev) {
  const text = rev ? git('show', `${rev}:mobile/package.json`) : readFileSync(join(root, 'mobile', 'package.json'), 'utf8');
  return text ? parse(JSON.parse(text).version) : null;
}

function upstream() {
  return git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}') || null;
}

function writeVersion(version) {
  const files = [];
  for (const dir of PACKAGES) {
    for (const name of ['package.json', 'package-lock.json']) {
      const file = join(root, dir, name);
      if (!existsSync(file)) continue;
      const json = JSON.parse(readFileSync(file, 'utf8'));
      json.version = version;
      if (json.packages?.['']) json.packages[''].version = version;
      writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
      files.push(join(dir, name));
    }
  }
  return files;
}

function needed() {
  const up = upstream();
  if (!up) return true;
  const head = versionAt('HEAD');
  const remote = versionAt(up);
  return !head || !remote || cmp(head, remote) <= 0;
}

function bump(kind) {
  if (!KINDS.has(kind)) throw new Error(`--bump must be one of: ${[...KINDS].join(', ')}`);
  const up = upstream();
  const candidates = [versionAt(''), versionAt('HEAD'), up ? versionAt(up) : null].filter(Boolean);
  const base = candidates.reduce((a, b) => (cmp(a, b) >= 0 ? a : b), [1, 0, 0]);
  const next = inc(base, kind).join('.');
  const files = writeVersion(next);
  execFileSync('git', ['add', '--', ...files], { cwd: root, stdio: 'inherit' });
  console.log(`Version ${base.join('.')} → ${next} (${kind})`);
}

function set(version) {
  if (!parse(version)) throw new Error(`--set needs a semantic version, got "${version}"`);
  writeVersion(version);
  console.log(`Version set to ${version} in: ${PACKAGES.join(', ')}`);
}

const [flag, value] = process.argv.slice(2);
if (flag === '--needed') process.exit(needed() ? 0 : 1);
else if (flag === '--bump') bump(value);
else if (flag === '--set') set(value);
else throw new Error('Usage: bump-version.mjs --needed | --bump <patch|minor|major> | --set <x.y.z>');
