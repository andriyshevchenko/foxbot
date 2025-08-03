# Agent‑Agnostic Rules (EO‑style, TypeScript + Playwright)

These rules are **tool‑neutral** and intended for any coding agent (Cursor, Windsurf, Copilot, Codeium, etc.).
They adapt the Elegant Objects (EO) principles to this TypeScript/Playwright codebase and supersede any previous generic rules.

## 0) Ground rules (tests‑first, CI‑green, composition)

1. **Tests first**: Every bug fix starts with a failing unit test; every feature starts with a test.
2. **CI must be green** before review/merge.
3. **Composition over branching & inheritance**: Use small objects that compose (e.g., `Sequence`, `When`, decorators). Avoid ad‑hoc if/else inside objects; keep decision logic in composition.

## 1) CQRS in objects (builders vs actions)

- **Builders (Queries)**: pure objects, one public method `value(): Promise<T>`; no side effects.
- **Actions (Manipulators)**: side‑effecting objects, one public method `perform(): Promise<void>`; **never return values**.
- Pass data by composing builders, not by returning values from actions.

## 2) TypeScript discipline

- `strict: true`; **no `any`** in source. Use `Query<T>`, `Action`, and Playwright’s `Locator` types.
- One class per file; named exports only; avoid default exports.
- Avoid implementation inheritance and “utils” modules; prefer composition of objects.
- Favor immutability: no reassigning object fields after construction; constructors do assignments only.

## 3) Playwright integration

- Encapsulate selectors in a `Locator` builder that accepts `{ page?: Page }` and throws if missing.
- Builders that **read** DOM depend on `Query<Locator>` (e.g., `TextOf`, `Presence`).
- Actions that **change** DOM accept `Query<Locator>` (e.g., `Click`, `Fill`).
- Prefer `Locator` methods over `ElementHandle`. No `page.waitForTimeout`; rely on locator auto‑wait and test assertions.

## 4) Testing layout & style

- **Unit**: under `tests/**` with **Vitest**; do not import Playwright.
- **E2E**: under `tests-e2e/**` with **Playwright Test** only.
- Keep tests short and deterministic. Prefer a single assertion as the last statement when reasonable.
- Prefer fakes/stubs over heavy mocks. Don’t assert on logs.
- Name tests as clear English sentences describing behavior.

## 5) Docs & messaging

- Brief JSDoc above classes/methods explains purpose and usage. Avoid repeating implementation details.
- Error/log messages: one sentence, no trailing period; precise and actionable.

## 6) CI & ops

- ESLint 9 flat config (`eslint.config.mjs`) and Prettier 3 are authoritative.
- Commit `package-lock.json`; CI uses `npm ci`.
- Keep pre‑commit fast (lint‑staged). Heavier checks (typecheck/tests) run on pre‑push or CI.

## 7) Changes needing explicit approval

- Adding a second public method to any builder/action.
- Returning data from an action.
- Introducing inheritance or new “utils” helpers that bypass objects.
