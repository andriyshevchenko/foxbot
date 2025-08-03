import { test, expect } from '@playwright/test';
import { Locator as FbLocator, Element as FbElement } from '../foxbot/playwright';
import { TextLiteral } from '../foxbot/builders/text_literal';
import { TextOf } from '../foxbot/builders/text_of';
import { ParsedDatetime } from '../foxbot/builders/parsed_datetime';
import { Now } from '../foxbot/builders/now';
import { DaysBetween } from '../foxbot/builders/days_between';
import { LessThan } from '../foxbot/builders/less_than';
import { NumberLiteral } from '../foxbot/core/number';
import { Click } from '../foxbot/actions/click';
import { When } from '../foxbot/actions/when';

/**
 * Best-practice E2E using Playwright Test fixtures:
 * - Uses built-in 'page' fixture (no custom session).
 * - Keeps assertions in the test, actions in objects.
 */
test.describe('connect if recent', () => {
  test('clicks when last post within 30 days', async ({ page }) => {
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

    // Wrap Playwright page inside our builders
    const locator = new FbLocator({ page } as any, 'div.last-post time');
    const cond = new LessThan(
      new DaysBetween(new ParsedDatetime(new TextOf(locator)), new Now()),
      new NumberLiteral(30)
    );

    await new When(
      cond,
      new Click(new FbElement(new FbLocator({ page } as any, 'button.connect')))
    ).perform();

    await expect(page.locator('body')).toHaveAttribute('data-connected', '1');
  });

  test('does not click when last post older than 30 days', async ({ page }) => {
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

    const locator = new FbLocator({ page } as any, 'div.last-post time');
    const cond = new LessThan(
      new DaysBetween(new ParsedDatetime(new TextOf(locator)), new Now()),
      new NumberLiteral(30)
    );

    await new When(
      cond,
      new Click(new FbElement(new FbLocator({ page } as any, 'button.connect')))
    ).perform();

    await expect(page.locator('body')).not.toHaveAttribute('data-connected', /./);
  });
});
