import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^#types\/(.+)\.js$/, replacement: path.resolve(rootDir, 'src/types/$1.ts') },
      { find: /^#utils\/(.+)\.js$/, replacement: path.resolve(rootDir, 'src/utils/$1.ts') },
      { find: /^#commands\/(.+)\.js$/, replacement: path.resolve(rootDir, 'src/commands/$1.ts') },
      { find: /^#app\/(.+)\.js$/, replacement: path.resolve(rootDir, 'src/$1.ts') },
      { find: /^(\.{1,2}\/.*)\.js$/, replacement: '$1' },
    ],
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
      ],
      reporter: ['text', 'lcov', 'html'],
      // thresholds: {
      //   branches: 74,
      //   functions: 78,
      //   lines: 79,
      //   statements: 79,
      // },
    },
  },
});
