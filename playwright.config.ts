import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests-e2e",
  /* Fail-fast retries on CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt into parallelism */
  fullyParallel: true,
  /* Reporter */
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  /* Shared settings for all tests */
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  /* Browser projects */
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
