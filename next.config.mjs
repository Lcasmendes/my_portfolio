import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this folder so Next doesn't traverse/watch the
  // parent directory (which has a stray package-lock.json + node_modules from
  // the résumé PDF tooling) — that was slowing dev compilation/file watching.
  outputFileTracingRoot: __dirname,
};

export default withNextIntl(nextConfig);
