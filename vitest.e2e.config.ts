import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests-e2e/**/*.ts'],
    reporters: ['dot'],
    testTimeout: 30000
  }
});
