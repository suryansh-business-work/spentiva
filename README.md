# Spentiva — chat-based expense manager

Type **“spend 20 on food”** and it's logged. Ask **“top spending last month”** and you get a chart.

|             |                                                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile**  | Expo SDK 57 · React Native 0.86 · Expo Router · Tamagui v2 · react-hook-form + zod · GraphQL Code Generator · TanStack Query · Chart.js (WebView) · react-icons (via react-native-svg) · date-fns |
| **Backend** | Node 22 · TypeScript · GraphQL (graphql-yoga) · MongoDB Atlas (mongoose) · OpenAI **gpt-4o** structured outputs · zod                                                                             |
| **Portal**  | React 19 · TypeScript · Vite · MUI 9 + MUI X (date pickers, charts) · React Router · TanStack Query · react-hook-form + zod · GraphQL Code Generator · date-fns                                   |
| **Deploy**  | Docker images (GHCR) → VPS over SSH → nginx + Let's Encrypt: API **https://spentiva.exyconn.com/graphql**, portal **https://spentiva.portal.exyconn.com**                                         |
| **CI/CD**   | GitHub Actions → semantic version → APK + AAB + IPA → `builds/`, GitHub Release, Google Drive, Slack                                                                                              |

---

## Features

- **Chat logging** – natural language (English/Hinglish) parsed by OpenAI (`gpt-4o`, configurable): several entries per message, past days (“yesterday”), other currencies (“$15 on lunch”).
- **Smart follow-ups** – if the _category_, _Expense On_ item or _Expense From_ (payment mode) isn't found or is ambiguous, the chat answers with **option chips** (pick one, or “+ New …” to create it). Every logged entry has **Undo**.
- **Reports in chat & Reports tab** – by category, by item (Expense On), by payment mode, daily, monthly, top spending, averages, income vs expense (savings rate & ratio), rendered with **Chart.js**.
- **Dashboard** (UX reference design) – weekly income/expense bars, income / expense / left for saving, savings rate, expense-to-income ratio, insights, top categories, recent entries.
- **Monthly budget** – remaining ring, per-category rings, days left & daily allowance, month-over-month comparison.
- **Dynamic settings** – categories with their own _Expense On_ items, payment modes (credit card, debit card, UPI, cash … anything), default payment mode, colours & icons.
- **Income tracking** with its own categories.
- **Multi-currency (ISO 4217)** – entries keep their original currency plus the amount in your base currency; changing the base currency re-expresses history.
- **Time zones (IANA) & locale (BCP 47)** – days/months are bucketed in the user's zone; dates and numbers are formatted from the user's Preferences; timestamps travel as **ISO 8601** UTC.
- **Auth** – email + password (bcrypt, JWT). The **first user is the admin** (or list emails in `ADMIN_EMAILS`).
- **Profile → Environment variables** (admins) – OpenAI API key & model, Slack bot token & **channel picker** (new builds are posted there). Stored AES-256-GCM encrypted, shown masked; anything not set in the app falls back to the server env (= GitHub Actions secrets).
- **Help & support** (Profile) – users raise a request (bug / question / feedback / account) and chat with the team; the app build and device are attached automatically.
- **Crash & error reporting** – every crash (including one while the app starts), render error, unhandled rejection and unexpected API failure is sent to the portal's **Logs**: who, when, why (message + stack), where (screen / page / API operation), app build, device and OS. A fatal error is written to disk before the app closes and sent on the next launch if it couldn't go out.

## Admin portal — https://spentiva.portal.exyconn.com

Admin accounts only (same login as the app). Responsive, so it works on a phone too.

| Section       | What it does                                                                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard** | Users (new / active / disabled), crashes and errors in the last 24 h, open support requests, problems per day, sign-ups per day, app versions in use, top unresolved errors                  |
| **Users**     | Search / filter / sort; per user: app build, last seen, entries, errors, tickets; edit name & role, disable / enable, reset password, delete with all data                                   |
| **Logs**      | MUI table of every crash / error from the app, portal and API with filters (level, source, status, dates, search); details drawer with stack trace, device, occurrences, resolve all similar |
| **Support**   | Requests from the app with status / priority; conversation view and reply (the user sees it in the app)                                                                                      |
| **Settings**  | Display time zone + locale for the portal, OpenAI key & model, Slack token & build channel                                                                                                   |

Forms use react-hook-form + zod; limits come from the API's public `validationRules` query, so the app, portal and server validate the same way. Tables keep page, sort and filters in the URL.

## Repository layout

```
backend/src
  models/            User, Category (+ Expense On items), PaymentSource, Transaction, ChatMessage, AppSetting
  services/ai.ts     OpenAI structured-output parser
  services/chat/     conversation flow: context, draft resolution, option handlers
  services/reports/  report builders (one per kind) + dashboard
  graphql/           schema (typeDefs.ts + schema/ logs, support, users), zod inputs, resolvers/
  services/          logs (crash reports), support, users, stats (portal dashboard)
portal/src
  pages/<Section>/   Dashboard, Users, UserDetail, Logs (+ LogDrawer), Support, Ticket, Settings
  forms/<name>/      <name>.form.tsx · <name>.types.tsx (zod schema from validationRules) · index.tsx
  components/        DataTable (server-paginated MUI table), form fields, dialogs, chips
  graphql/ · gql/    operations → generated types (GraphQL Code Generator)
mobile/src
  app/               Expo Router routes (thin re-exports of screens/)
  screens/<Name>/    screen folders, index-based (every .tsx < 200 lines)
  forms/<name>/      <name>.form.tsx · <name>.types.tsx (zod schema + types) · index.tsx
  components/        Tamagui UI kit (ui/), form fields (form/), ChartView, Ring, Icon, ConfirmDialog
  graphql/           operations → generated types in gql/ (GraphQL Code Generator)
  hooks/             React Query queries / mutations / chat
scripts/             bump-version.mjs, version.mjs, collect-builds.mjs, android-launch-check.sh, upload-drive.mjs, notify-slack.mjs, ios-build.sh, setup-secrets.mjs
builds/              APK / AAB / IPA per version (written by CI)
.github/workflows/   release.yml (apps) · deploy-backend.yml (API) · deploy-portal.yml (portal) · ci.yml (PRs)
```

## Run locally

```bash
# API
cd backend && cp .env.example .env   # MONGODB_URI, JWT_SECRET, OPENAI_API_KEY
npm install && npm run dev           # http://localhost:4000/graphql

# App (Expo Go or a dev build)
cd mobile && npm install
npx expo start                       # uses https://spentiva.exyconn.com/graphql by default

# Portal
cd portal && cp .env.example .env    # VITE_API_URL
npm install && npm run dev           # http://localhost:5174
```

After cloning, run `npm install` once in the repo root: it installs the git hooks (husky).

The app's server can be changed on the login screen (**Server: …**) — handy for a local API.

Quality gates (also enforced in CI): `npm run lint` (zero warnings), `npm run format:check`, `npm run typecheck`; in `mobile/` also `npm run codegen` (regenerates `src/gql` from the backend schema — commit the result).

### Try the chat

| You type                                                                                                     | What happens                                               |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `spend 20 on food`                                                                                           | Logged to _Food_ from your default payment mode            |
| `paid 500 for petrol via upi`                                                                                | _Transport · Fuel_, paid via _UPI_                         |
| `spent 300 on dog grooming`                                                                                  | “No such category” → options + **+ New “Dog Grooming”**    |
| `spent 99 on coffee with amex`                                                                               | “Amex isn't a payment mode” → pick one or **+ Add “Amex”** |
| `salary 50000 credited`                                                                                      | Income under _Salary_                                      |
| `$15 lunch yesterday`                                                                                        | USD entry, converted to your currency, dated yesterday     |
| `top spending last month` · `daily food expense this week` · `average spend` · `income vs expense this year` | Chart + key numbers in the chat                            |

## Branches, versions and builds

- **Push only to `staging`** (feature branch → `staging`). When verified, open a PR `staging → main`; merging releases production.
- **One version bump per push** – the husky pre-commit hook asks _major / minor / patch_ on the first commit after a push and bumps `mobile`, `backend` and `portal` together (`scripts/bump-version.mjs`). Without a terminal (e.g. the VS Code commit button) it uses `VERSION_BUMP=patch|minor|major`, else patch. Later commits before the push don't ask again.
- **Every push to `staging`** runs **Build & Release Apps**:
  1. lint · format · types · codegen check;
  2. the version from `mobile/package.json` (bumped by the hook); if a push didn't bump it, the next version comes from [Conventional Commits](https://www.conventionalcommits.org) — `feat:` → minor, `fix:`/other → patch, `feat!:` / `BREAKING CHANGE` → major;
  3. **APK + AAB** (Ubuntu) and **IPA** (macOS) in parallel;
  4. committed to **`builds/staging/vX.Y.Z/`** (+ `build-info.json` with SHA-256s, index in [`builds/README.md`](builds/README.md)), `mobile/package.json` bumped, tag `vX.Y.Z-staging` (bot commit is `[skip ci]` — pull afterwards);
  5. GitHub pre-release, upload to **Google Drive** (`Spentiva/staging/vX.Y.Z/`) and the files are posted to **Slack**.
- A push to `main` (the merge) does the same as a production release (`builds/production/vX.Y.Z/`, tag `vX.Y.Z`).
- Android `versionCode` = `major*1_000_000 + minor*1_000 + patch` (iOS build number too). Only the newest 10 versions per channel stay in `builds/` (`KEEP_BUILDS`); every version stays in Releases/Drive. Files > 95 MB are released but not committed (GitHub limit).
- **Android launch check** – in parallel, CI builds the same release APK for x86_64, opens it on an emulator and checks it's still running 30 s later; logcat, the crash buffer and a screenshot are kept as the `launch-check` artifact. Diagnostic only, it never blocks a release (this is how the v1.0.2 crash on open was found).
- Backend changes (`backend/**`) trigger **Deploy Backend**, portal changes (`portal/**`) trigger **Deploy Portal** (container `spentiva-portal` on `127.0.0.1:4101`, vhost `/etc/nginx/sites-available/spentiva.portal.exyconn.com.conf`).

## Backend deployment (Docker over SSH)

`Deploy Backend` builds `ghcr.io/suryansh-business-work/spentiva-api`, then over SSH runs it on the VPS as container **`spentiva-api`** on `127.0.0.1:4100` (`API_PORT`), with a health check. nginx (`/etc/nginx/sites-available/spentiva.exyconn.com.conf`, Let's Encrypt) proxies **https://spentiva.exyconn.com** to it. The deploy is skipped (with a warning) until `MONGODB_URI` and `JWT_SECRET` exist.

CI connects with a dedicated key (`SSH_PRIVATE_KEY`; its public key is in `/root/.ssh/authorized_keys` tagged `spentiva-github-actions-deploy` — delete that line to revoke).

## Secrets (GitHub → Settings → Secrets and variables → Actions)

Repository secrets are the **defaults for everything**; the `staging` / `production` environments can override them. Set them with `gh auth login && node scripts/setup-secrets.mjs`.

| Secret                                                                                                 | For                | Status / notes                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                                                          | API                | **required** – MongoDB Atlas connection string                                      |
| `OPENAI_API_KEY` · `OPENAI_MODEL`                                                                      | API                | **required for chat** – model defaults to `gpt-4o`; admins can override in the app  |
| `JWT_SECRET` · `CI_TOKEN` · `SETTINGS_SECRET`                                                          | API / CI           | set (generated)                                                                     |
| `API_URL`                                                                                              | app build          | set – `https://spentiva.exyconn.com/graphql`                                        |
| `SSH_HOST` · `SSH_USER` · `SSH_PRIVATE_KEY` (`SSH_PORT`)                                               | deploy             | set                                                                                 |
| `SLACK_BOT_TOKEN` · `SLACK_CHANNEL_ID`                                                                 | builds → Slack     | optional defaults; the channel chosen in the app wins (read via `GET /ci/config`)   |
| `GDRIVE_FOLDER_ID` · `GDRIVE_CLIENT_ID` · `GDRIVE_CLIENT_SECRET` · `GDRIVE_REFRESH_TOKEN`              | builds → Drive     | OAuth client + refresh token with scope `https://www.googleapis.com/auth/drive`     |
| `ANDROID_KEYSTORE_BASE64` · `ANDROID_KEYSTORE_PASSWORD` · `ANDROID_KEY_ALIAS` · `ANDROID_KEY_PASSWORD` | Play Store signing | optional – otherwise the debug key signs the APK (installable, not Play-uploadable) |
| `IOS_P12_BASE64` · `IOS_P12_PASSWORD` · `IOS_PROVISION_PROFILE_BASE64`                                 | signed IPA         | optional – otherwise the IPA is **unsigned**                                        |

Variables: `API_PORT=4100` (set), `ENABLE_IOS_BUILD=false` (skip macOS), `IOS_BUNDLE_ID`, `ADMIN_EMAILS`, `CORS_ORIGIN`, `GDRIVE_SHARE_ANYONE=true`.

**Slack:** create an app at <https://api.slack.com/apps> → Bot scopes `chat:write`, `files:write`, `channels:read` (+ `groups:read`) → install → `/invite @YourApp` in the channel → paste the `xoxb-…` token in **Profile → Environment variables → Slack** and pick the channel.

**Google Drive:** Cloud Console → enable _Google Drive API_ → OAuth client (Desktop) → get a refresh token (e.g. OAuth Playground with your client, scope `drive`) → set the four `GDRIVE_*` secrets (`GDRIVE_FOLDER_ID` = id in the folder URL).

**Android release key:** `keytool -genkeypair -v -storetype JKS -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`, then `base64 -w0 upload.jks` → `ANDROID_KEYSTORE_BASE64`.

## Standards

ISO 4217 currencies · IANA time zones · ISO 8601 date-times & weeks · BCP 47 locales · Semantic Versioning 2.0 · Conventional Commits.
