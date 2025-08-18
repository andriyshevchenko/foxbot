# TypeScript Code Generation Rules [v1.0]

## Usage Guide

- Rules have severity: [C]ritical, [H]igh, [M]edium, [L]ow
- When rules conflict: Higher severity wins → Existing code patterns take precedence
- Process rules by severity (Critical first)

## Architecture & Structure [A]

- **[A1-C]** The existing code structure must not be changed without a strong reason.
- **[A2-C]** Every bug must be reproduced by a unit test before being fixed.
- **[A3-C]** Every new feature must be covered by a unit test before it is implemented.
- **[A4-M]** Minor inconsistencies and typos in the existing code may be fixed.
- **[A5-H]** All CI workflows must pass before code changes may be reviewed.
- **[A6-H]** The DDD paradigm must be respected.
- **[A7-H]** Functional programming principles must be favored over imperative patterns.
- **[A8-H]** TypeScript strict mode must be enabled and respected.

## Code Style & Patterns [S]

- **[S1-H]** Function bodies may not contain blank lines.
- **[S2-H]** Function bodies may not contain comments.
- **[S3-M]** Variable names must be single nouns, never compound or composite.
- **[S4-M]** Function names must be single verbs, never compound or composite.
- **[S5-H]** The principle of "Paired Brackets" must be respected.
- **[S6-M]** Error and log messages should not end with a period.
- **[S7-M]** Error and log messages must always be a single sentence, with no periods inside.
- **[S8-H]** Favor "fail fast" paradigm over "fail safe": throw exception earlier.
- **[S9-M]** Function names must respect the CQRS principle: they must be either nouns or verbs.
- **[S10-H]** Modules must avoid using exported constants at module level.
- **[S11-H]** Prefer `const` assertions and `as const` over mutable declarations.
- **[S12-M]** Use explicit return types for all public functions and methods.

## Type & Interface Requirements [T]

- **[T1-C]** Every interface and type must have a supplementary JSDoc comment preceding it.
- **[T2-H]** Interface JSDoc must explain the purpose and provide usage examples.
- **[T3-H]** Prefer interfaces over type aliases for object shapes.
- **[T4-C]** Use union types instead of inheritance for polymorphism.
- **[T5-H]** Generic constraints must be as specific as possible.
- **[T6-M]** Interface names may not end with the -er suffix.
- **[T7-H]** Favor readonly properties over mutable ones.
- **[T8-H]** Immutable data structures must be favored over mutable ones.
- **[T9-C]** Utility types are strictly prohibited; create specific interfaces instead.
- **[T10-C]** `any` type is strictly prohibited; use `unknown` with type guards.
- **[T11-H]** Use branded types for domain-specific primitives.

## Class Requirements [C]

- **[C1-C]** Every class must have a supplementary JSDoc comment preceding it.
- **[C2-H]** Class JSDoc must explain the purpose and provide usage examples.
- **[C3-H]** Constructors may not contain any code except assignment statements.
- **[C4-C]** Implementation inheritance must be avoided; favor composition.
- **[C5-H]** Getters must be avoided as they indicate anemic object model.
- **[C6-H]** Setters must be avoided as they make objects mutable.
- **[C7-H]** All class properties must be declared `readonly` when possible.
- **[C8-H]** Every class may encapsulate no more than four properties.
- **[C9-H]** Every class must encapsulate at least one property.
- **[C10-C]** Classes with only static methods are strictly prohibited.
- **[C11-C]** Static methods in classes are strictly prohibited.
- **[C12-H]** Prefer factory functions over classes when no state is needed.

## Function Requirements [F]

- **[F1-C]** Every function must have a supplementary JSDoc comment preceding it.
- **[F2-H]** Functions must be declared with explicit interfaces when part of public API.
- **[F3-H]** Public functions that do not implement an interface must be avoided.
- **[F4-C]** Functions must never return `null` or `undefined`; use `Option<T>` pattern.
- **[F5-M]** Functions should avoid checking incoming arguments for validity.
- **[F6-C]** `null` or `undefined` may not be passed as arguments.
- **[F7-C]** Type assertions (`as`) are strictly prohibited; use type guards.
- **[F8-H]** Error messages must include as much context as possible.
- **[F9-H]** Prefer pure functions over functions with side effects.
- **[F10-H]** Use function overloads instead of union parameter types.
- **[F11-M]** Arrow functions must be used for inline callbacks only.

## Module & Import Requirements [M]

- **[M1-H]** Use explicit imports; avoid `import *` syntax.
- **[M2-H]** Group imports: external libraries, internal modules, relative imports.
- **[M3-M]** Prefer named exports over default exports.
- **[M4-H]** Each module must have a single responsibility.
- **[M5-M]** Barrel exports (`index.ts`) should be used sparingly.
- **[M6-H]** Circular dependencies are strictly prohibited.

## Documentation [D]

- **[D1-H]** The README.md file must explain the purpose of the repository.
- **[D2-H]** The README.md file must be free of typos, grammar mistakes, and broken English.
- **[D3-M]** The README.md file must be as short as possible and must not duplicate code documentation.
- **[D4-H]** JSDoc comments must be written in English only, using UTF-8 encoding.
- **[D5-H]** All public APIs must have complete JSDoc documentation.
- **[D6-M]** Use `@example` tags in JSDoc for complex functions.

## Testing Standards [TS]

- **[TS1-C]** Every change must be covered by a unit test to guarantee repeatability.
- **[TS2-H]** Every test case may contain only one assertion.
- **[TS3-H]** In every test, the assertion must be the last statement.
- **[TS4-M]** Test cases must be as short as possible.
- **[TS5-H]** Every test must assert at least once.
- **[TS6-M]** Each test file must have a one-to-one mapping with the feature file it tests.
- **[TS7-H]** Every assertion must include a failure message that is a negatively toned claim about the error.
- **[TS8-M]** Tests must use irregular inputs, such as Unicode strings and edge case numbers.
- **[TS9-H]** Tests may not share object attributes or state.
- **[TS10-H]** Tests may not use `beforeEach()` or `afterEach()` hooks.
- **[TS11-H]** Tests may not use module-level constants or shared fixtures.
- **[TS12-M]** Tests must be named as full English sentences, stating what the function under test does.
- **[TS13-H]** Tests may not test functionality irrelevant to their stated purpose.
- **[TS14-H]** Tests must clean up resources they use, such as file handles and network connections.
- **[TS15-H]** Objects must not provide functionality used only by tests.
- **[TS16-M]** Tests may not assert on side effects such as console output.
- **[TS17-L]** Tests may not check the behavior of getters, setters, or constructors.
- **[TS18-M]** Tests must not clean up after themselves; instead, they must prepare a clean state at the start.
- **[TS19-H]** Tests should not use mocks; favor fake objects and stubs.
- **[TS20-M]** The best tests consist of a single statement.
- **[TS21-M]** Tests should use Jest matchers or similar assertion libraries.
- **[TS22-H]** Each test must verify only one specific behavioral pattern of the function it tests.
- **[TS23-M]** Tests must use random values as inputs when appropriate.
- **[TS24-M]** Tests should use temporary directories for file operations, not the project directory.
- **[TS25-H]** Tests are not allowed to produce any console output.
- **[TS26-H]** The testing framework must be configured to suppress logging from tested code.
- **[TS27-H]** Tests must not wait indefinitely; they must always have timeouts.
- **[TS28-H]** Tests must verify function behavior in asynchronous environments.
- **[TS29-H]** Tests must retry potentially flaky async operations.
- **[TS30-H]** Tests must assume the absence of network connectivity.
- **[TS31-M]** Tests may not assert on error messages or codes.
- **[TS32-H]** Tests must not rely on default configurations, providing explicit parameters.
- **[TS33-H]** Tests must not mock the file system or network; use test doubles.
- **[TS34-M]** Tests must use ephemeral ports for network testing.
- **[TS35-M]** Tests should inline small fixtures instead of loading from files.
- **[TS36-M]** Tests should generate large fixtures at runtime.
- **[TS37-M]** Tests may create helper functions to avoid code duplication.
- **[TS38-L]** Test names must spell "cannot" and "dont" without apostrophes.
- **[TS39-H]** Use `expect.assertions()` to verify expected number of assertions.
- **[TS40-H]** Async tests must use `async/await` syntax, not Promise chains.

## TypeScript-Specific Rules [TSS]

- **[TSS1-C]** Enable strict mode in `tsconfig.json` with all strict flags.
- **[TSS2-H]** Use discriminated unions for complex state management.
- **[TSS3-H]** Prefer `const` assertions for literal types.
- **[TSS4-H]** Use template literal types for string validation.
- **[TSS5-M]** Leverage mapped types for transformations.
- **[TSS6-H]** Use conditional types sparingly and document them well.
- **[TSS7-H]** Prefer type predicates over type assertions.
- **[TSS8-M]** Use `satisfies` operator for type checking without widening.
- **[TSS9-H]** Implement proper error handling with Result<T, E> pattern.
- **[TSS10-H]** Use `never` type to ensure exhaustive checking.

## AI Code Generation Process [AI]

- **[AI1-H]** Analyze existing code patterns and TypeScript configuration first
- **[AI2-H]** Write tests before implementation
- **[AI3-H]** Design interfaces and types before implementation
- **[AI4-H]** Implement with immutability and type safety in mind
- **[AI5-H]** Error handling: validate early, use Result<T, E> pattern, throw specific errors
- **[AI6-H]** Leverage TypeScript's type system for compile-time safety
- **[AI7-H]** Prefer functional composition over class inheritance
