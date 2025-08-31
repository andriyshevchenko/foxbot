import type { Query } from "#foxbot/core";

/**
 * Spoofs the Permissions API for notification queries.
 *
 * @example
 * ```typescript
 * const q = new PermissionsApi();
 * const s = await q.value();
 * ```
 */
export class PermissionsApi implements Query<string> {
  constructor(
    private readonly code: string = `const query = navigator.permissions.query.bind(navigator.permissions);
navigator.permissions.query = permission =>
  permission.name === "notifications"
    ? Promise.resolve({ state: Notification.permission })
    : query(permission);`
  ) {}
  async value(): Promise<string> {
    return this.code;
  }
}
