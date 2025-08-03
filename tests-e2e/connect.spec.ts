import { test, expect } from "@playwright/test";
import { Locator as FbLocator } from "../foxbot/playwright";
import { TextOf } from "../foxbot/builders/text_of";
import { ParsedDatetime } from "../foxbot/builders/parsed_datetime";
import { Now } from "../foxbot/builders/now";
import { DaysBetween } from "../foxbot/builders/days_between";
import { LessThan } from "../foxbot/builders/less_than";
import { NumberLiteral } from "../foxbot/core/number";
import { Click } from "../foxbot/actions/click";
import { When } from "../foxbot/actions/when";

test.describe("connect if recent", () => {
  test("clicks when last post within 30 days", async ({ page }) => {
    await page.setContent(`
      <html><body>
        <div class="last-post"><time>10 days ago</time></div>
        <button class="connect">Connect</button>
        <script>
          document.querySelector('.connect')!.addEventListener('click', () => {
            document.body.setAttribute('data-connected','1');
          });
        </script>
      </body></html>
    `);

    const recentPost = new FbLocator({ page }, "div.last-post time");
    const cond = new LessThan(
      new DaysBetween(new ParsedDatetime(new TextOf(recentPost)), new Now()),
      new NumberLiteral(30)
    );

    await expect(page.locator("button.connect")).toBeVisible();
    expect(await cond.value()).toBe(true);

    expect(await cond.value()).toBe(true);

    await new When(cond, new Click(new FbLocator({ page }, "button.connect"))).perform();

    await expect(page.locator("body")).toHaveAttribute("data-connected", "1");
  });

  test("does not click when last post older than 30 days", async ({ page }) => {
    await page.setContent(`
      <html><body>
        <div class="last-post"><time>200 days ago</time></div>
        <button class="connect">Connect</button>
        <script>
          document.querySelector('.connect')!.addEventListener('click', () => {
            document.body.setAttribute('data-connected','1');
          });
        </script>
      </body></html>
    `);

    const oldPost = new FbLocator({ page }, "div.last-post time");
    const cond = new LessThan(
      new DaysBetween(new ParsedDatetime(new TextOf(oldPost)), new Now()),
      new NumberLiteral(30)
    );

    await new When(cond, new Click(new FbLocator({ page }, "button.connect"))).perform();

    await expect(page.locator("body")).not.toHaveAttribute("data-connected", /./);
  });
});
