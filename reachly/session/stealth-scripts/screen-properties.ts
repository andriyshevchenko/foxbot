import type { Query } from "#foxbot/core";

/**
 * Screen dimension spoof values.
 *
 * @example
 * ```typescript
 * const s: ScreenProps = { width: 1920, height: 1080, taskbar: 40 };
 * ```
 */
export interface ScreenProps {
  /** Total screen width. */
  readonly width: number;
  /** Total screen height. */
  readonly height: number;
  /** Taskbar height to subtract. */
  readonly taskbar: number;
}

/**
 * Generates a script spoofing screen properties.
 */
export class ScreenProperties implements Query<string> {
  constructor(private readonly props: ScreenProps) {}
  async value(): Promise<string> {
    const { width, height, taskbar } = this.props;
    const code = `Object.defineProperties(screen, {
  width: { get: () => ${width} },
  height: { get: () => ${height} },
  availWidth: { get: () => ${width} },
  availHeight: { get: () => ${height - taskbar} }
});`;
    return code;
  }
}
