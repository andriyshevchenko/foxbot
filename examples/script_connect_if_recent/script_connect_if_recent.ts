import { Locator } from "../../foxbot/playwright";
import { TextLiteral } from "../../foxbot/builders/text_literal";
import { TextOf } from "../../foxbot/builders/text_of";
import { Now } from "../../foxbot/builders/now";
import { DaysBetween } from "../../foxbot/builders/days_between";
import { LessThan } from "../../foxbot/builders/less_than";
import { NumberLiteral } from "../../foxbot/core/number";
import { Navigate } from "../../foxbot/actions/navigate";
import { Click } from "../../foxbot/actions/click";
import { When } from "../../foxbot/actions/when";
import { Sequence } from "../../foxbot/actions/sequence";
import { ParsedDatetime } from "../../foxbot/builders/parsed_datetime";
import { chromium } from "playwright";

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await new Sequence([
    new Navigate(page, new TextLiteral("https:www.linkedin.com/in/target/")),
    new When(
      new LessThan(
        new DaysBetween(
          new ParsedDatetime(new TextOf(new Locator(page, "div.last-post time"))),
          new Now()
        ),
        new NumberLiteral(30)
      ),
      new Click(new Locator(page, "button.connect"))
    ),
  ]).perform();

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
