# Stealth Scripts Modular Architecture

## Overview

The `StealthSession` class uses a modular approach for injecting stealth scripts. Instead of one large `addInitScript` call, each stealth technique resides in its own class implementing `Query<string>` and can be injected independently.

## Benefits of Modular Approach

### 1. **Maintainability**

- Each stealth technique is isolated in its own file
- Easier to understand, debug, and modify individual components
- Clear separation of concerns

### 2. **Testability**

- Each script class can be unit tested independently
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
├── index.ts                    # Exports all stealth classes
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

### Injection Methods

Each stealth technique has its own injection method in the `StealthSession` class:

- `injectWebDriverRemoval()` - Removes automation detection flags
- `injectCdcRemoval()` - Removes Chrome DevTools Console indicators
- `injectChromeRuntimeSpoof()` - Creates fake Chrome runtime environment
- `injectPermissionsApiSpoof()` - Handles permissions API properly
- `injectNavigatorPluginsSpoof()` - Adds realistic browser plugins
- `injectNavigatorLanguagesSpoof()` - Sets appropriate language preferences
- `injectDevicePropertiesSpoof()` - Mimics real device characteristics
- `injectScreenPropertiesSpoof()` - Sets realistic screen dimensions
- `injectWebGLContextSpoof()` - Spoofs graphics card information
- `injectMouseTracking()` - Simulates human mouse movement patterns
- `injectBoundingRectJitter()` - Adds natural variance to measurements
- `injectFetchTimingHumanization()` - Adds human-like delays to requests

## Usage Examples

### Basic Usage (All Techniques)

```typescript
const stealthSession = new StealthSession(baseSession, viewport, graphics, host, device, location);
await stealthSession.open(); // Automatically injects all stealth scripts
```

### Selective Injection (Future Enhancement)

```typescript
// Future enhancement - selective injection
const stealthSession = new ConfigurableStealthSession(baseSession, {
  webdriverRemoval: true,
  cdcRemoval: true,
  chromeRuntime: false, // Skip this one
  // ... other options
});
```

### Custom Script Testing

```typescript
import { NavigatorPlugins } from "./stealth-scripts";

// Test individual script generation
const script = await new NavigatorPlugins(2).value();
console.log(script); // Generated JavaScript code
```

## Adding New Stealth Techniques

1. **Create a new script file** in `stealth-scripts/`
2. **Export a class** implementing `Query<string>` that returns a JavaScript string
3. **Add the export** to `stealth-scripts/index.ts`
4. **Create an injection method** in `StealthSession`
5. **Call the method** from `injectStealthScripts()`
6. **Add unit tests** for the new technique

### Example New Technique

```typescript
// stealth-scripts/example-technique.ts
import type { Query } from "#foxbot/core";

export class ExampleTechnique implements Query<string> {
  constructor(private readonly value: string) {}
  async value(): Promise<string> {
    return `Object.defineProperty(navigator,"exampleProperty",{get:()=>"${this.value}"});`;
  }
}

// In StealthSession class
private async injectExampleSpoof(context: BrowserContext): Promise<void> {
  const script = await new ExampleTechnique("fake-value").value();
  await context.addInitScript(script);
}
```

## Testing

Each stealth script class is unit tested to verify:

- Correct JavaScript code generation
- Proper parameter substitution
- Expected string content inclusion

Run tests with:

```bash
npm test -- stealth-scripts.test.ts
```

## Migration from Monolithic Approach

The original monolithic `addInitScript` has been replaced with:

1. **Multiple focused methods** for better organization
2. **Proper TypeScript typing** with `BrowserContext` and `SessionData`
3. **Individual script injection** for better error isolation
4. **Modular script classes** for reusability

This refactoring maintains the same functionality while significantly improving code quality, maintainability, and testability.
