I need to implement a Playwright Session object which will be used to connect to a LinkedIn page and perform various tasks. The only purpose is to orchestrate a session, no page interaction (click, navigate etc) should happen at the moment.

I will develop a separate browser extension which will be used upon real LinkedIn page and capture LinkedIn cookies (li_at, JSESSIONID) as well as comprehensive browser, device information location etc. Session object must receive this information as constructor argument, preferably JSON string.

Rationale: Copy real human session as much as possible. Because session will be used in e2e tests, it must not ever be detected by LinkedIn as a bot.

Use page.route to block images/fonts/videos/trackers to reduce renderer memory. (Technique is standard in Playwright docs and guides.)

Code style: minimalist, prefer readability over performance, no design patterns, no abstractions, inline private methods which are called only once, no null/undefined, no static methods, no logic in constructors, don't cache anything, objects should be immutable.

Object should implement /foxbot/playwright/session.ts interface

Object should be implemented under /reachly/playwright directory. No docs except comprehensive JDoc. No readme, no examples.

use Context7.
