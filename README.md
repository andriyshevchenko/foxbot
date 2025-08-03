# Foxbot — Declarative Automation on Playwright

**Foxbot** is a lightweight, open‑source framework that builds **declarative, composable, reusable, testable workflows** on top of Playwright.  
Instead of writing long, procedural, line‑by‑line scripts, you assemble **objects** that either **read** facts (Queries) or **do** things (Actions), and compose them into higher‑level behaviors.

> TL;DR: stop scripting, start composing.

---

## Why

Traditional browser automation mixes **what** you want with **how** to do it (imperative steps). This makes code brittle, hard to reuse, and hard to test.  
Foxbot follows the _Elegant Objects_ style to split behavior into:

- **Queries** (builders): _pure_ objects with one public method `value(): Promise<T>` that compute or read values (e.g., text of an element).
- **Actions** (manipulators): _side‑effecting_ objects with one public method `perform(): Promise<void>` that change the world (e.g., click a button).

You then **compose** them (e.g., `Sequence`, `When`, `Delay`) to define robust workflows for E2E testing, scraping, and automation.

---

## Key ideas

- **Declarative by composition** — compose small objects into workflows; no giant functions.
- **Reusable** — the same Actions/Queries are used across tests and bots.
- **Testable** — Queries are pure and easy to unit test; Actions can be exercised in E2E.
- **Deterministic** — prefer Playwright `Locator` auto‑waits over sleeps/timeouts.
- **Readable** — supports _Paired Brackets_ formatting to visualize nested composition.

---

## Example (connect only if the user posted recently)

```ts
import { PageSession, Locator } from "./foxbot/playwright";
import { TextOf } from "./foxbot/builders/text_of";
import { ParsedDatetime } from "./foxbot/builders/parsed_datetime";
import { Now } from "./foxbot/builders/now";
import { DaysBetween } from "./foxbot/builders/days_between";
import { LessThan } from "./foxbot/builders/less_than";
import { NumberLiteral } from "./foxbot/core/number";
import { Click } from "./foxbot/actions/click";
import { When } from "./foxbot/actions/when";

async function connectIfRecent(session: PageSession) {
  await new When(
    new LessThan(
      new DaysBetween(
        new ParsedDatetime(new TextOf(new Locator(session, "div.last-post time"))),
        new Now()
      ),
      new NumberLiteral(30)
    ),
    new Click(new Locator(session, "button.connect"))
  ).perform();
}
```

---

## Folder conventions

- `foxbot/core` — interfaces: `Query<T>`, `Action`.
- `foxbot/builders` — **Queries** (pure): `TextOf`, `Presence`, `DaysBetween`, etc.
- `foxbot/actions` — **Actions** (effects): `Click`, `Fill`, `Navigate`, `Sequence`, `When`.
- `foxbot/playwright` — thin adapters for Playwright (`PageSession`, `Locator`).

Unit tests live in `tests/**` (Vitest). E2E specs live in `tests-e2e/**` (Playwright Test).

---

## Extending

1. Add a new **Query** for any value you need (e.g., `AttributeOf`, `InnerHTMLOf`).
2. Add a new **Action** for any effect (e.g., `Upload`, `ScrollIntoView`).
3. Compose with `Sequence` and `When` to define a workflow.
4. Unit test Queries; validate end‑to‑end in Playwright Test.

---

## Design rules (short form)

- **Queries**: one public method `value()`, no side effects, no `any`.
- **Actions**: one public method `perform()`, return `void`, no data return in chain.
- Prefer `Locator` over `ElementHandle`; avoid `page.waitForTimeout`.
- Keep classes small (≤4 fields), one class per file, named exports only.
- No implementation inheritance, no “utils” dumping grounds; favor composition.

---

## Status

The framework is intentionally minimal and extensible. Contributions welcome—see `docs/` and the AI rules in `.ai/` for style and architectural constraints.
