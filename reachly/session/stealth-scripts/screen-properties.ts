/**
 * Spoofs screen properties like width, height, and available dimensions.
 */
export function spoofScreenProperties(defaultTaskbarHeight: number): string {
  return `
    Object.defineProperty(screen, "width", {
      get: async () => await sessionData.viewport.screenWidth(),
    });
    
    Object.defineProperty(screen, "height", {
      get: async () => await sessionData.viewport.screenHeight(),
    });
    
    Object.defineProperty(screen, "availWidth", {
      get: async () => await sessionData.viewport.screenWidth(),
    });
    
    const screenHeight = await sessionData.viewport.screenHeight();
    const taskbarHeight = (await sessionData.viewport.taskbarHeight()) || ${defaultTaskbarHeight};
    Object.defineProperty(screen, "availHeight", {
      get: () => screenHeight - taskbarHeight,
    });
  `;
}
