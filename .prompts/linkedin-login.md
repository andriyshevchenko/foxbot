I need to implement a LinkedIn login workflow via login and password provided via base64 encoded environment variables LINKEDIN_USERNAME, LINKEDIN_PASSWORD.

I want playwright code to be resilient to markup change, without me ever changing the selector/locator algorithm.

Using XPATH with CSS selectors, id selectors, page.evaluate is forbidden.

Because workflow will run in e2e tests, it must not ever be detected as bot. Therefore, the proper timeouts/throttling must be applied. Timeout intervals must not be hardcoded, class-level constants should be used.

Retry mechanism should not be implemented now, but rather adequate playwright usage and error handling should be in place.

/foxbot/core/action.ts interface must be implemented. Class must be under reachly/workflows directory. Class must be stateless and don't cache anything.

/foxbot/playwright/session.ts must be accepted as constructor parameter to access playwright objects. Assume session already opened.

Feel free to create a new foxbot primitives, just follow the existing patterns.

Proper unit tests must be generated.

/.kiro/steering/typescript.md must be followed on each step (workflow creation, primitive creation, testing)

e2e - skip for now.
