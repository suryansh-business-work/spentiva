#!/usr/bin/env node
/**
 * Moves CI artifacts into builds/<channel>/v<version>/, writes build-info.json and
 * regenerates builds/README.md + builds/latest.json.
 *
 *   node scripts/collect-builds.mjs --from ./artifacts --channel staging --version 1.2.3 --version-code 1002003
 *
 * Files over MAX_MB are not committed (GitHub rejects files > 100 MB); they are still
 * attached to the GitHub Release and uploaded to Drive/Slack.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => (cur.startsWith('--') ? [...acc, [cur.slice(2), arr[i + 1]]] : acc), []),
);
const MAX_MB = Number(process.env.MAX_COMMIT_MB || 95);
const buildsDir = join(root, 'builds');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function collect() {
  const { from, channel, version } = args;
  if (!from || !channel || !version) throw new Error('--from, --channel and --version are required');
  const target = join(buildsDir, channel, `v${version}`);
  mkdirSync(target, { recursive: true });

  const files = walk(from).filter((f) => /\.(apk|aab|ipa)$/i.test(f));
  if (!files.length) throw new Error(`No .apk/.aab/.ipa found in ${from}`);

  const entries = files.map((file) => {
    const buf = readFileSync(file);
    const sizeMb = buf.length / 1024 / 1024;
    const name = basename(file);
    const committed = sizeMb <= MAX_MB;
    if (committed) copyFileSync(file, join(target, name));
    else console.warn(`::warning::${name} is ${sizeMb.toFixed(1)} MB (> ${MAX_MB} MB) – not committed, see Release/Drive`);
    return {
      file: name,
      type: name.split('.').pop().toLowerCase(),
      sizeMb: Number(sizeMb.toFixed(2)),
      sha256: createHash('sha256').update(buf).digest('hex'),
      committed,
    };
  });

  const info = {
    app: 'Spentiva',
    version,
    versionCode: Number(args['version-code'] || 0),
    channel,
    tag: args.tag ?? null,
    commit: process.env.GITHUB_SHA ?? null,
    branch: process.env.GITHUB_REF_NAME ?? null,
    runUrl: process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null,
    builtAt: new Date().toISOString(),
    files: entries,
  };
  writeFileSync(join(target, 'build-info.json'), `${JSON.stringify(info, null, 2)}\n`);
  console.log(`Collected ${entries.length} file(s) into ${relative(root, target)}`);
  return info;
}

/** Keep only the newest KEEP_BUILDS versions per channel in the working tree (older ones stay in Releases/Drive) */
function prune() {
  const keep = Number(process.env.KEEP_BUILDS || 10);
  if (!keep) return;
  for (const channel of ['staging', 'production']) {
    const dir = join(buildsDir, channel);
    if (!existsSync(dir)) continue;
    const versions = readdirSync(dir)
      .filter((d) => /^v\d+\.\d+\.\d+$/.test(d))
      .map((d) => ({ d, version: d.slice(1) }))
      .sort(semverDesc);
    for (const { d } of versions.slice(keep)) {
      rmSync(join(dir, d), { recursive: true, force: true });
      console.log(`Pruned builds/${channel}/${d}`);
    }
  }
}

function semverDesc(a, b) {
  const pa = a.version.split('.').map(Number);
  const pb = b.version.split('.').map(Number);
  return pb[0] - pa[0] || pb[1] - pa[1] || pb[2] - pa[2];
}

function reindex() {
  const infos = walk(buildsDir)
    .filter((f) => basename(f) === 'build-info.json')
    .map((f) => ({ ...JSON.parse(readFileSync(f, 'utf8')), dir: relative(buildsDir, dirname(f)).replace(/\\/g, '/') }))
    .sort(semverDesc);

  const latest = {};
  for (const ch of ['production', 'staging']) {
    const hit = infos.find((i) => i.channel === ch);
    if (hit)
      latest[ch] = { version: hit.version, versionCode: hit.versionCode, builtAt: hit.builtAt, dir: hit.dir, files: hit.files.map((f) => f.file) };
  }
  writeFileSync(join(buildsDir, 'latest.json'), `${JSON.stringify(latest, null, 2)}\n`);

  const row = (i) =>
    `| ${i.version} | ${i.channel} | ${i.builtAt.slice(0, 10)} | ${i.commit ? `\`${i.commit.slice(0, 7)}\`` : '—'} | ${i.files
      .map((f) => (f.committed ? `[${f.type.toUpperCase()}](${i.dir}/${f.file}) (${f.sizeMb} MB)` : `${f.type.toUpperCase()} (release only)`))
      .join(' · ')} |`;
  const md = `# Spentiva builds

Generated automatically by GitHub Actions on every push to \`staging\` and \`main\`.
Versions follow [Semantic Versioning](https://semver.org) from Conventional Commits
(\`feat:\` → minor, \`fix:\`/others → patch, \`!\`/\`BREAKING CHANGE\` → major).

- **production/** – builds from \`main\`
- **staging/** – builds from \`staging\`

> The IPA is unsigned unless iOS signing secrets are configured (see the root README).

| Version | Channel | Built | Commit | Files |
|---|---|---|---|---|
${infos.map(row).join('\n') || '| — | — | — | — | — |'}
`;
  writeFileSync(join(buildsDir, 'README.md'), md);
  console.log(`Indexed ${infos.length} build(s)`);
}

mkdirSync(buildsDir, { recursive: true });
if (args.from) collect();
prune();
reindex();
