import type { Browser } from "playwright";
import { TextLiteral } from "../../foxbot/builders";
import { Query } from "../../foxbot/core";
import {
  AuthenticatedSession,
  DefaultSession,
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  OptimizedSession,
  StealthSession,
} from "../../reachly/sessions";

/**
 * Creates LinkedIn session using the decorator composition pattern based on a shared JSON string.
 * The same JSON string is provided to each Json* component so they can extract their respective data.
 */
function createLinkedInSession(jsonSource: string, browserQuery: Query<Browser>) {
  return new StealthSession(
    new OptimizedSession(
      new AuthenticatedSession(
        new DefaultSession(
          new JsonViewport(new TextLiteral(jsonSource)),
          new JsonHost(new TextLiteral(jsonSource)),
          new JsonLocation(new TextLiteral(jsonSource)),
          browserQuery
        ),
        new JsonHost(new TextLiteral(jsonSource))
      )
    ),
    new JsonViewport(new TextLiteral(jsonSource)),
    new JsonGraphics(new TextLiteral(jsonSource)),
    new JsonHost(new TextLiteral(jsonSource)),
    new JsonDevice(new TextLiteral(jsonSource)),
    new JsonLocation(new TextLiteral(jsonSource))
  );
}

/**
 * Example of using the LinkedIn session composition pattern
 */
async function main(): Promise<void> {
  // Shared JSON string consumed by the Json* components (replace placeholder values with real ones)
  const json = `{
    "userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "locale":"en-US",
    "timezone":"America/New_York",
    "headers":{},
    "cookies":[{"name":"li_at","value":"your_li_at_cookie_value","domain":".linkedin.com"},{"name":"JSESSIONID","value":"your_jsession_id","domain":".linkedin.com"}],
    "viewportWidth":1920,
    "viewportHeight":1080,
    "screenWidth":1920,
    "screenHeight":1080,
    "devicePixelRatio":1,
    "taskbarHeight":40,
    "platform":"Win32",
    "deviceMemory":8,
    "hardwareConcurrency":16,
    "webglVendor":"Google Inc.",
    "webglRenderer":"ANGLE (NVIDIA)",
    "latitude":40.7128,
    "longitude":-74.0060
  }`;

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
    const session = createLinkedInSession(json, browserQuery);

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
    await session.close();
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
