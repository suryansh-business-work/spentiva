# Spentiva — chat-based expense manager

Type **“spend 20 on food”** and it's logged. Ask **“top spending last month”** and you get a chart.

|             |                                                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile**  | Expo SDK 57 · React Native 0.86 · Expo Router · Tamagui v2 · react-hook-form + zod · GraphQL Code Generator · TanStack Query · Chart.js (WebView) · react-icons (via react-native-svg) · date-fns |
| **Backend** | Node 22 · TypeScript · GraphQL (graphql-yoga) · MongoDB Atlas (mongoose) · OpenAI **gpt-4o** structured outputs · zod                                                                             |
| **Deploy**  | Docker image (GHCR) → VPS over SSH → nginx + Let's Encrypt at **https://spentiva.exyconn.com/graphql**                                                                                            |
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

## Repository layout

```
backend/src
  models/            User, Category (+ Expense On items), PaymentSource, Transaction, ChatMessage, AppSetting
  services/ai.ts     OpenAI structured-output parser
  services/chat/     conversation flow: context, draft resolution, option handlers
  services/reports/  report builders (one per kind) + dashboard
  graphql/           schema, zod inputs, resolvers/ (auth, catalog, money, chat, admin)
mobile/src
  app/               Expo Router routes (thin re-exports of screens/)
  screens/<Name>/    screen folders, index-based (every .tsx < 200 lines)
  forms/<name>/      <name>.form.tsx · <name>.types.tsx (zod schema + types) · index.tsx
  components/        Tamagui UI kit (ui/), form fields (form/), ChartView, Ring, Icon, ConfirmDialog
  graphql/           operations → generated types in gql/ (GraphQL Code Generator)
  hooks/             React Query queries / mutations / chat
scripts/             version.mjs, collect-builds.mjs, upload-drive.mjs, notify-slack.mjs, ios-build.sh, setup-secrets.mjs
builds/              APK / AAB / IPA per version (written by CI)
.github/workflows/   release.yml (apps) · deploy-backend.yml (API) · ci.yml (PRs)
```

## Run locally

```bash
# API
cd backend && cp .env.example .env   # MONGODB_URI, JWT_SECRET, OPENAI_API_KEY
npm install && npm run dev           # http://localhost:4000/graphql

# App (Expo Go or a dev build)
cd mobile && npm install
npx expo start                       # uses https://spentiva.exyconn.com/graphql by default
```

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
- **Every push to `staging`** runs **Build & Release Apps**:
  1. lint · format · types · codegen check;
  2. next **semantic version** from [Conventional Commits](https://www.conventionalcommits.org) since the last staging release — `feat:` → minor, `fix:`/other → patch, `feat!:` / `BREAKING CHANGE` → major (first release: `1.0.0` from `mobile/package.json`);
  3. **APK + AAB** (Ubuntu) and **IPA** (macOS) in parallel;
  4. committed to **`builds/staging/vX.Y.Z/`** (+ `build-info.json` with SHA-256s, index in [`builds/README.md`](builds/README.md)), `mobile/package.json` bumped, tag `vX.Y.Z-staging` (bot commit is `[skip ci]` — pull afterwards);
  5. GitHub pre-release, upload to **Google Drive** (`Spentiva/staging/vX.Y.Z/`) and the files are posted to **Slack**.
- A push to `main` (the merge) does the same as a production release (`builds/production/vX.Y.Z/`, tag `vX.Y.Z`).
- Android `versionCode` = `major*1_000_000 + minor*1_000 + patch` (iOS build number too). Only the newest 10 versions per channel stay in `builds/` (`KEEP_BUILDS`); every version stays in Releases/Drive. Files > 95 MB are released but not committed (GitHub limit).
- Backend changes (`backend/**`) trigger **Deploy Backend** instead of an app build.

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
