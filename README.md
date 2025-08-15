# 🦊 Foxbot — Compose Browser Automation, Declaratively

![CI](https://github.com/andriyshevchenko/foxbot/actions/workflows/ci.yml/badge.svg)

**Foxbot** is a minimal, composable automation framework built on **Playwright**.  
It lets you express browser workflows as **objects**, not scripts—splitting _what_ you want from _how_ to do it.

> 💡 TL;DR: Stop scripting. Start composing.

---

## 🧠 Why Foxbot?

Browser scripts often mix logic, state, and sequencing—making them fragile and hard to test.  
**Foxbot** fixes this by embracing object composition over imperative control flow.

We model two primitives:

- ✅ **Queries** — pure, stateless readers with `.value(): Promise<T>`
- ⚡ **Actions** — side-effecting operations with `.perform(): Promise<void>`

These building blocks compose naturally into robust, **reusable**, and **testable** automations.

---

## 🧩 Key Concepts

| Feature          | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| 🔁 Composable    | Build behavior from small, testable building blocks              |
| 🔍 Declarative   | Describe intent, not steps                                       |
| ♻️ Reusable      | Use the same Queries and Actions across tests and workflows      |
| 🧪 Testable      | Queries are pure: unit-test them easily                          |
| ⏱ Deterministic | Leverages Playwright’s built-in auto-waiting via `Locator`s      |
| 📖 Readable      | Supports “Paired Brackets” formatting for visual nesting clarity |

---

## 🚀 Example: Connect If Recent

```ts
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
```

> ✔️ Declarative: No `if`, no `Date`, no `await` chains—just pure behavior objects.

---

## 📁 Project Structure

| Folder                 | Contents                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `core/`                | Interfaces: `Query<T>`, `Action`                            |
| `builders/`            | Queries like `TextOf`, `DaysBetween`, `Presence`, etc.      |
| `actions/`             | Actions like `Click`, `Fill`, `Sequence`, `When`, etc.      |
| `playwright/`          | Thin adapters: `Locator`                                    |
| `tests/`, `tests-e2e/` | Unit and integration tests using Vitest and Playwright Test |

---

## 🛠️ Extend Foxbot

1. **Create a Query** — e.g., `AttributeOf`, `InnerHTMLOf`
2. **Create an Action** — e.g., `UploadFile`, `ScrollToBottom`
3. **Compose behavior** — via `Sequence`, `When`, etc.
4. **Write tests** — unit test Queries, run Actions in E2E flows

---

## 📏 Design Rules

- Queries: pure, no side effects, expose `.value()`
- Actions: side effects only, expose `.perform()`, return `void`
- No `any`, no utils folders, no inheritance trees—favor composition
- Prefer `Locator` over `ElementHandle`; avoid hardcoded timeouts
- One class per file, ≤ 4 fields per class

---

## 📦 Status

Foxbot is small by design and easy to extend.  
Want to contribute? Check out `docs/` and the `.ai/` design rules before submitting PRs.

---

## 💬 Philosophy

> Foxbot brings the composability of functional programming into UI automation—bridging the gap between tests, bots, and domain logic.
