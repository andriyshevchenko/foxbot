import type { Browser } from "playwright";

import { NumberLiteral } from "#foxbot/core";
import { OptimizedSession } from "#foxbot/session";
import { TextLiteral } from "#foxbot/value";
import {
  AuthenticatedSession,
  DefaultSession,
  JsonDevice,
  JsonGraphics,
  JsonHost,
  JsonLocation,
  JsonViewport,
  StealthSession,
} from "#reachly/session";
import {
  BoundingRectJitter,
  CdcRemoval,
  ChromeRuntime,
  DeviceProperties,
  FetchTiming,
  MouseTracking,
  NavigatorLanguages,
  NavigatorPlugins,
  PermissionsApi,
  ScreenProperties,
  WebDriverRemoval,
  WebGLContext,
} from "#reachly/session/stealth-scripts";

import type { Query } from "#foxbot/core";

/**
 * Creates LinkedIn session using the decorator composition pattern based on a shared JSON string.
 * The same JSON string is provided to each Json* component so they can extract their respective data.
 */
function createLinkedInSession(jsonSource: string, browserQuery: Query<Browser>) {
  const data = new TextLiteral(jsonSource);
  const base = new OptimizedSession(
    new AuthenticatedSession(
      new DefaultSession(
        new JsonViewport(data),
        new JsonHost(data),
        new JsonLocation(data),
        browserQuery
      ),
      new JsonHost(data)
    )
  );
  const scripts = [
    new WebDriverRemoval(),
    new CdcRemoval(),
    new ChromeRuntime(),
    new PermissionsApi(),
    new NavigatorPlugins(new NumberLiteral(1)),
    new NavigatorLanguages(new JsonHost(data)),
    new DeviceProperties(new JsonDevice(data)),
    new ScreenProperties(new JsonViewport(data), new NumberLiteral(40)),
    new WebGLContext(new JsonGraphics(data)),
    new MouseTracking(new NumberLiteral(50)),
    new BoundingRectJitter(new NumberLiteral(0.1), new NumberLiteral(0.5)),
    new FetchTiming(new NumberLiteral(5), new NumberLiteral(15)),
  ];
  return new StealthSession(base, scripts);
}

/**
 * Example of using the LinkedIn session composition pattern
 */
async function main(): Promise<void> {
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
      return chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    },
  };
  const session = createLinkedInSession(json, browserQuery);
  const context = await session.profile();
  const page = await context.newPage();
  await page.close();
  await context.close();
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { main };
