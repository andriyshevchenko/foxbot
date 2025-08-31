/* c8 ignore file */
import type { Device } from "#reachly/session/device";
import type { Graphics } from "#reachly/session/graphics";
import type { Host } from "#reachly/session/host";
import type { Location } from "#reachly/session/location";
import type { Viewport } from "#reachly/session/viewport";

/**
 * Data describing a browser session for stealth operations
 * @example
 * ```typescript
 * const data: SessionData = { viewport, graphics, host, device, location };
 * ```
 */
export interface SessionData {
  viewport: Viewport;
  graphics: Graphics;
  host: Host;
  device: Device;
  location: Location;
}
