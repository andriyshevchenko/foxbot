import { Query } from "#foxbot/core";

/**
 * Spoofs permissions API to handle notification permissions properly.
 */
export class PermissionsApi implements Query<string> {
  constructor() {}
  async value(): Promise<string> {
    return `
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => {
        if (parameters.name === "notifications") {
          return Promise.resolve({ state: Notification.permission });
        }
        return originalQuery(parameters);
      };
    `;
  }
}
