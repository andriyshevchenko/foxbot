import { Query } from "../../foxbot/core";

export class StealthArgs implements Query<string> {
  constructor() {}

  async value(): Promise<string> {
    const defaultChromeArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ];
    return defaultChromeArgs.join(",");
  }
}
