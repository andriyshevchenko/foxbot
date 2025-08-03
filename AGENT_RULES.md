# Agent-Agnostic Rules (Foxbot, EO-style, TypeScript + Playwright)

These rules are tool-neutral for any coding agent/editor.

## A. Architectural axioms (EO split)

1. **Queries (builders)** are pure objects with exactly one public method: `value(): Promise<T>`.
2. **Actions (manipulators)** are side-effecting objects with exactly one public method: `perform(): Promise<void>` and **never return values**.
3. Composition over branching: prefer `Sequence`, `When`, `Delay` and decorators (e.g., `LoggedAction`, `SafeText`) instead of adding logic branches inside objects.

## B. Strict code style (EO-inspired)

- No setters; avoid getters. Favor immutability (`readonly` fields).
- No implementation inheritance; prefer composition. Classes are effectively “final.”
- No static “utils” bags. One class per file. Named exports only.
- Class names don’t end in “-er”. Variables are single nouns; methods single verbs; CQRS: builders noun-like ok, actions verb.
- Constructors do assignments only; prefer one primary constructor.
- Objects small (≤4 fields). At least one encapsulated field.
- No `null` in arguments/returns. Avoid type introspection/casts/reflection.
- Paired Brackets format is allowed to show deep composition in scripts.
- Method bodies concise; error/log messages: single sentence, no trailing period.
- Public methods should implement interfaces (`Query<T>`, `Action`).

## C. TypeScript + Playwright

- `strict: true`; **no `any`** in source. Use `Query<T>` and Playwright `Locator`.
- Builders that read DOM: depend on `Query<Locator>`; Actions that manipulate DOM: accept `Query<Locator>`.
- Prefer `Locator` APIs over `ElementHandle`; avoid `page.waitForTimeout`.

## D. Testing & CI

- **Tests-first**: every bug/feature starts with a test.
- Unit: `tests/**` with Vitest (no Playwright imports).
- E2E: `tests-e2e/**` with Playwright Test; do not run E2E under Vitest.
- CI must be green before review; commit `package-lock.json`; use `npm ci`.
