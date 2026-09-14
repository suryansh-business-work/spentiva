import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // One version for app, API and portal (scripts/bump-version.mjs keeps package.json in sync)
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  server: { port: 5174 },
  build: { sourcemap: false, chunkSizeWarningLimit: 1200 },
});
