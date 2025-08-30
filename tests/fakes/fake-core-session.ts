/**
 * Fake session implementation for foxbot core testing purposes.
 * Only implements methods actually used in foxbot core tests to avoid violating type rules.
 *
 * @example
 * ```typescript
 * const session = new FakeCoreSession();
 * const context = await session.profile();
 * ```
 */
export class FakeCoreSession {
  async profile() {
    return {
      newPage: async () => ({}),
      pages: () => [{}],
    };
  }
}
