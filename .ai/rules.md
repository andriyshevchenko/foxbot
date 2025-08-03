# AI Edit Rules (Generic)

- Queries: one public method `value(): Promise<T>`, pure.
- Actions: one public method `perform(): Promise<void>`, side-effecting; **no return**.
- Composition > branching: `Sequence`, `When`, `Delay`; decorators for cross-cutting.
- No setters; avoid getters; immutable/readonly fields; no inheritance; no static “utils”.
- Names: variables are single nouns; methods single verbs; classes don’t end in “-er”; CQRS for builders/actions.
- Constructors do assignments only; keep objects small (≤4 fields).
- No `null` in args/returns; avoid casts/reflection.
- Use Playwright `Locator` (not `ElementHandle`) where possible; avoid `waitForTimeout`.
- Tests-first; CI must be green; unit in `tests/**`, E2E in `tests-e2e/**` (Playwright Test only).
