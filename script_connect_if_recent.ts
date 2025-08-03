import { PageSession, Locator } from "./foxbot/playwright";
import { TextLiteral } from "./foxbot/builders/text_literal";
import { TextOf } from "./foxbot/builders/text_of";
import { Now } from "./foxbot/builders/now";
import { DaysBetween } from "./foxbot/builders/days_between";
import { LessThan } from "./foxbot/builders/less_than";
import { NumberLiteral } from "./foxbot/core/number";
import { Navigate } from "./foxbot/actions/navigate";
import { Click } from "./foxbot/actions/click";
import { When } from "./foxbot/actions/when";
import { Sequence } from "./foxbot/actions/sequence";
import { ParsedDatetime } from "./foxbot/builders/parsed_datetime";

async function main(): Promise<void> {
  const session = new PageSession(true);
  await session.start();

  await new Sequence( //
    [
      //
      new Navigate( //
        session, //
        new TextLiteral( //
          "https://www.linkedin.com/in/target/" //
        ) //
      ), //
      new When( //
        new LessThan( //
          new DaysBetween( //
            new ParsedDatetime( //
              new TextOf( //
                new Locator( //
                  session, //
                  "div.last-post time" //
                ) //
              ) //
            ), //
            new Now() //
          ), //
          new NumberLiteral(30) //
        ), //
        new Click(new Locator(session, "button.connect"))
      ), //
    ] //
  ).perform(); //

  await session.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
