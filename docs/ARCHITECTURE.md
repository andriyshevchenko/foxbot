# Architecture (EO‑style)

- Queries (builders) are pure: `value(): Promise<T>`.
- Actions (manipulators) are side‑effecting: `perform(): Promise<void>`.
- Prefer composition (Sequence, When, Delay) and decorators (LoggedAction, SafeText).
- Playwright usage goes through `Locator` objects; avoid `ElementHandle` when possible.
