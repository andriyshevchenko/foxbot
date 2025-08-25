import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/e2e/**/*.test.ts"],
    reporters: ["dot"],
    testTimeout: 30000, // increase for browser spin-up
    hookTimeout: 30000,
    teardownTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./output/coverage",
      include: ["foxbot/**", "reachly/**"],
      exclude: ["node_modules/**", "tests/**", "**/*.test.ts", "**/*.e2e.test.ts", "**/*.d.ts"],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
});
