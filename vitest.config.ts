import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    reporters: ["dot"],
    testTimeout: 30000, // increase for browser spin-up
    hookTimeout: 30000,
    teardownTimeout: 30000,
  },
});
