# Contributing

## Setup

```bash
npm install
npx playwright install
```

## Local checks

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

## PR checklist

- Tests added first and passing locally
- ESLint 9 + Prettier 3 pass
- Lockfile updated; CI green
