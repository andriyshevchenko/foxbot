import { Query } from "#foxbot/core";
import type { Viewport } from "#reachly/session/viewport";

/**
 * Spoofs screen properties like width, height, and available dimensions.
 */
export class ScreenProperties implements Query<string> {
  constructor(
    private readonly viewport: Viewport,
    private readonly taskbar: Query<number>
  ) {}
  async value(): Promise<string> {
    const width = await this.viewport.screenWidth();
    const height = await this.viewport.screenHeight();
    const bar = await this.viewport.taskbarHeight();
    const base = bar || (await this.taskbar.value());
    const avail = height - base;
    return `
      Object.defineProperty(screen, "width", { get: () => ${width} });
      Object.defineProperty(screen, "height", { get: () => ${height} });
      Object.defineProperty(screen, "availWidth", { get: () => ${width} });
      Object.defineProperty(screen, "availHeight", { get: () => ${avail} });
    `;
  }
}
