import type { Device } from "#reachly/session/device";
import type { Graphics } from "#reachly/session/graphics";
import type { Host } from "#reachly/session/host";
import type { Location } from "#reachly/session/location";
import type { Viewport } from "#reachly/session/viewport";

export interface SessionData {
  viewport: Viewport;
  graphics: Graphics;
  host: Host;
  device: Device;
  location: Location;
}
