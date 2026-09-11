/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GraphQL endpoint, e.g. https://spentiva.exyconn.com/graphql */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** package.json version, injected by vite.config.ts */
declare const __APP_VERSION__: string;
