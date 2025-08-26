import type { Device } from "../device";
import type { Graphics } from "../graphics";
import type { Host } from "../host";
import type { Location } from "../location";
import type { Viewport } from "../viewport";

export interface SessionData {
  viewport: Viewport;
  graphics: Graphics;
  host: Host;
  device: Device;
  location: Location;
}
