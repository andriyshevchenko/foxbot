# AI Edit Rules (Short Checklist)

- Builders (Queries) are pure: `value(): Promise<T>` only.
- Actions (Manipulators) are side‑effecting: `perform(): Promise<void>` only (no return values).
- Compose with `Sequence`, `When`, `Delay` and decorators; avoid branching inside objects.
- Strict TypeScript; no `any`. Prefer `Query<T>` and Playwright `Locator`.
- Selectors are wrapped in a `Locator` builder that accepts `{ page?: Page }`.
- Unit tests = Vitest in `tests/**`; E2E = Playwright Test in `tests-e2e/**`.
- ESLint 9 + Prettier 3 must pass; lockfile committed; CI uses `npm ci`.
- Tests‑first; CI‑green before review.
