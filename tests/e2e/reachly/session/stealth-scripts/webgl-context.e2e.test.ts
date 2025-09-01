import { chromium } from "playwright";
import { expect, it } from "vitest";

import { WebGLContext } from "#reachly/session/stealth-scripts";
import { FakeGraphics } from "#tests/fakes";

it("spoofs webgl vendor string", async () => {
  expect.assertions(1);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const script = new WebGLContext(new FakeGraphics("v", "r"));
  const code = await script.value();
  await page.evaluate((c: string) => eval(c), code);
  const value = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    return gl ? gl.getParameter(gl.VENDOR) : "";
  });
  await browser.close();
  expect(value === "v", "WebGLContext did not spoof vendor").toBe(true);
});
