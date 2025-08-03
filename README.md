# Foxbot (TypeScript)
Minimal Playwright-based EO-style automation skeleton with tests, hooks, and CI.

## Setup
```bash
npm i
npm run build
npm run lint
npm run test
npm run start
```

### Git hooks
Husky is configured with a `pre-commit` hook that runs lint, typecheck, tests, and lint-staged.
Hooks are installed automatically by `npm i` via the `prepare` script.

### CI
GitHub Actions workflow runs lint, typecheck, tests, and build.

## E2E (Playwright Test best practices)
- Runner: `@playwright/test` with fixtures, retries on CI, HTML report, traces & video on failure.
- Scripts: `npm run test:e2e`, `npm run test:e2e:ui`, `npm run test:e2e:headed`, `npm run pw:report`.
- CI runs a browser matrix and uploads reports & traces as artifacts.
