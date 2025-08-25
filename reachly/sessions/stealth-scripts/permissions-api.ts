/**
 * Spoofs permissions API to handle notification permissions properly.
 */
export function spoofPermissionsApi(): string {
  return `
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: PermissionDescriptor) => {
      if (parameters.name === "notifications") {
        return Promise.resolve({ state: Notification.permission } as PermissionStatus);
      }
      return originalQuery(parameters);
    };
  `;
}
