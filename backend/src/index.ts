import { timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { createSchema, createYoga, type Plugin } from 'graphql-yoga';
import { env, isProd } from './config/env.js';
import { connectDb, disconnectDb } from './db.js';
import { createContext, type Context } from './graphql/context.js';
import { resolvers } from './graphql/resolvers/index.js';
import { typeDefs } from './graphql/typeDefs.js';
import { getSetting } from './services/appSettings.js';

function authorizedCi(header: string | null): boolean {
  const expected = process.env.CI_TOKEN;
  const given = header?.replace(/^Bearer\s+/i, '') ?? '';
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/**
 * `/` + `/healthz` for uptime checks, and `GET /ci/config` so the GitHub Actions build
 * pipeline can read the Slack channel chosen in the app (protected by CI_TOKEN).
 */
const httpRoutes: Plugin = {
  async onRequest({ request, url, endResponse, fetchAPI }) {
    const json = (body: unknown, status = 200) =>
      endResponse(new fetchAPI.Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));
    if (url.pathname === '/' || url.pathname === '/healthz') {
      json({ name: 'spentiva-api', status: 'ok', graphql: '/graphql' });
      return;
    }
    if (url.pathname !== '/ci/config') return;
    if (!authorizedCi(request.headers.get('authorization'))) {
      json({ error: 'unauthorized' }, 401);
      return;
    }
    const [token, channelId, channelName] = await Promise.all([
      getSetting('SLACK_BOT_TOKEN'),
      getSetting('SLACK_CHANNEL_ID'),
      getSetting('SLACK_CHANNEL_NAME'),
    ]);
    json({ slack: { token, channelId, channelName } });
  },
};

const yoga = createYoga({
  schema: createSchema<Context>({ typeDefs, resolvers }),
  context: createContext,
  graphqlEndpoint: '/graphql',
  graphiql: !isProd,
  landingPage: false,
  plugins: [httpRoutes],
  cors: {
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  },
});

const server = createServer(yoga);

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down…`);
  server.close();
  await disconnectDb();
  process.exit(0);
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    shutdown(signal).catch((err: unknown) => {
      console.error('Shutdown failed', err);
      process.exit(1);
    });
  });
}

try {
  await connectDb();
  server.listen(env.PORT, () => console.log(`Spentiva API ready at http://localhost:${env.PORT}/graphql`));
} catch (err) {
  console.error('Failed to start server', err);
  process.exit(1);
}
