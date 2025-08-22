import type { Browser } from "playwright";

import { Query } from "../../foxbot/core";
import {
  AuthenticatedSession,
  DefaultSession,
  OptimizedSession,
  SessionData,
  StealthSession,
} from "../../reachly/sessions";

/**
 * Creates LinkedIn session using the decorator composition pattern.
 * This is the actual pattern you should use in your code.
 */
function createLinkedInSession(sessionData: SessionData, browserQuery: Query<Browser>) {
  return new StealthSession(
    new OptimizedSession(
      new AuthenticatedSession(new DefaultSession(sessionData, browserQuery), sessionData)
    ),
    sessionData
  );
}

/**
 * Example of using the LinkedIn session composition pattern
 */
async function main(): Promise<void> {
  // Example session data - replace with your actual values
  const sessionData: SessionData = {
    li_at: "your_li_at_cookie_value",
    JSESSIONID: "your_jsession_id",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewportWidth: 1920,
    viewportHeight: 1080,
    timezone: "America/New_York",
    locale: "en-US",
    cookies: {},
    httpHeaders: {},
  };

  const browserQuery: Query<Browser> = {
    async value(): Promise<Browser> {
      const { chromium } = await import("playwright");
      return await chromium.launch({
        headless: true, // Change to false to see the browser
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    },
  };

  try {
    // Create the composed session
    const session = createLinkedInSession(sessionData, browserQuery);

    // Use the session
    await session.open();
    console.log("✅ LinkedIn session created and opened");

    // The session now has all the capabilities:
    // - DefaultSession: Basic browser setup
    // - AuthenticatedSession: LinkedIn cookies
    // - OptimizedSession: Resource blocking
    // - StealthSession: Anti-detection

    // You can now use the session for LinkedIn automation
    // Example: Get browser context and create pages
    const context = await session.browser();
    const page = await context.newPage();

    console.log("📱 Created page with full session capabilities");

    // Clean up
    await page.close();
    await session[Symbol.asyncDispose]();
    console.log("🧹 Session cleaned up");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { main };
