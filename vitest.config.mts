import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, '.') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['app/**/*.test.{ts,tsx}', 'components/**/*.test.{ts,tsx}', 'utils/**/*.test.ts', 'data/**/*.test.ts'],
  },
});
