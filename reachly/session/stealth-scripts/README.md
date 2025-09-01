# Stealth Scripts Modular Architecture

## Overview

The `StealthSession` class uses a modular approach for injecting stealth scripts. Instead of having one large `addInitScript` call with all stealth mechanisms combined, each stealth technique is separated into its own query class. These queries are composed into an array and injected together.

## Benefits of Modular Approach

### 1. **Maintainability**

- Each stealth technique is isolated in its own file
- Easier to understand, debug, and modify individual components
- Clear separation of concerns

### 2. **Testability**

- Each script query can be unit tested independently
- Easier to verify the correct script generation for each technique
- Better test coverage and more focused test cases

### 3. **Reusability**

- Individual stealth scripts can be used in other contexts
- Can easily compose different combinations of stealth techniques
- Modules can be shared across different session types

### 4. **Configurability**

- Each technique can be enabled/disabled independently
- Parameters can be customized per technique
- Easier to add conditional logic for specific scenarios

### 5. **Performance**

- Only necessary stealth scripts are injected
- Reduced script size if not all techniques are needed
- Better browser performance due to smaller init scripts

## Architecture

### Directory Structure

```
stealth-scripts/
├── index.ts                    # Exports all stealth queries
├── session-data.ts            # TypeScript interfaces
├── webdriver-removal.ts       # Removes navigator.webdriver
├── cdc-removal.ts            # Removes Chrome DevTools Console properties
├── chrome-runtime.ts         # Spoofs window.chrome.runtime
├── permissions-api.ts        # Spoofs navigator.permissions
├── navigator-plugins.ts      # Spoofs navigator.plugins
├── navigator-languages.ts   # Spoofs navigator.languages
├── device-properties.ts     # Spoofs device-specific navigator properties
├── screen-properties.ts     # Spoofs screen dimensions
├── webgl-context.ts         # Spoofs WebGL vendor/renderer info
├── mouse-tracking.ts        # Tracks mouse movements for human behavior
├── bounding-rect-jitter.ts  # Adds variance to element measurements
└── fetch-timing.ts          # Humanizes fetch request timing
```

### Script Composition

Each stealth technique is an individual query object implementing `Query<string>`. To use them, compose an array of queries and provide it to `StealthSession`:

```typescript
import { StealthSession } from "#reachly/session";
import {
  BoundingRectJitter,
  CdcRemoval,
  ChromeRuntime,
  DeviceProperties,
  FetchTiming,
  MouseTracking,
  NavigatorLanguages,
  NavigatorPlugins,
  PermissionsApi,
  ScreenProperties,
  WebDriverRemoval,
  WebGLContext,
} from "#reachly/session/stealth-scripts";
import { NumberLiteral } from "#foxbot/core";

const scripts = [
  new WebDriverRemoval(),
  new CdcRemoval(),
  new ChromeRuntime(),
  new PermissionsApi(),
  new NavigatorPlugins(new NumberLiteral(1)),
  new NavigatorLanguages(host),
  new DeviceProperties(device),
  new ScreenProperties(viewport, new NumberLiteral(40)),
  new WebGLContext(graphics),
  new MouseTracking(new NumberLiteral(50)),
  new BoundingRectJitter(new NumberLiteral(0.1), new NumberLiteral(0.5)),
  new FetchTiming(new NumberLiteral(5), new NumberLiteral(15)),
];

const stealthSession = new StealthSession(baseSession, scripts);
```

## Usage Examples

### Custom Script Testing

```typescript
import { NavigatorPlugins } from "./stealth-scripts";
import { NumberLiteral } from "#foxbot/core";

const script = await new NavigatorPlugins(new NumberLiteral(2)).value();
console.log(script);
```

## Adding New Stealth Techniques

1. **Create a new script file** in `stealth-scripts/`
2. **Export a class** that implements `Query<string>`
3. **Accept `Query<T>` instances** for primitive constructor arguments
4. **Add the export** to `stealth-scripts/index.ts`
5. **Include the query in the scripts array** passed to `StealthSession`
6. **Add unit tests** for the new technique

### Example New Technique

```typescript
import { Query } from "#foxbot/core";
import { TextLiteral } from "#foxbot/value";

export class ExampleProperty implements Query<string> {
  constructor(private readonly value: Query<string>) {}
  async value(): Promise<string> {
    const value = await this.value.value();
    return `
      Object.defineProperty(navigator, "exampleProperty", {
        get: () => "${value}",
      });
    `;
  }
}

const scripts = [new ExampleProperty(new TextLiteral("fake-value"))];
const stealthSession = new StealthSession(baseSession, scripts);
```

## Testing

Each stealth script query is unit tested to verify:

- Correct JavaScript code generation
- Proper parameter substitution
- Expected string content inclusion

Run tests with:

```bash
npm test -- stealth-scripts.test.ts
```

## Migration from Monolithic Approach

The original monolithic `addInitScript` has been replaced with:

1. **Array-based script composition** for better organization
2. **Proper TypeScript typing** with `BrowserContext` and `SessionData`
3. **Individual script queries** for better error isolation
4. **Modular script classes** for reusability

This refactoring maintains the same functionality while significantly improving code quality, maintainability, and testability.
