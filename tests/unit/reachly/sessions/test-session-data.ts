import { Query } from "#foxbot/core/query";

/**
 * Test session data generator implementing Query<string>.
 * Generates randomized session data for testing with unicode characters.
 */
export class TestSessionData implements Query<string> {
  constructor(private readonly data: Map<string, string>) {}

  async value(): Promise<string> {
    const r = Math.random().toString(36).substring(2, 12);
    const li_at = this.data.get("li_at") || `тест_li_at_${r}`;
    const JSESSIONID = this.data.get("JSESSIONID") || `세션_id_${r}`;
    const userAgent = this.data.get("userAgent") || `TestAgent/测试_${r}`;
    const viewportWidth = this.data.get("viewportWidth") || "1366";
    const viewportHeight = this.data.get("viewportHeight") || "768";
    const timezone = this.data.get("timezone") || "Europe/Kiev";
    const locale = this.data.get("locale") || "uk-UA";
    const screenWidth = this.data.get("screenWidth") || "1920";
    const screenHeight = this.data.get("screenHeight") || "1080";
    const devicePixelRatio = this.data.get("devicePixelRatio") || "1.5";
    const latitude = this.data.get("latitude") || "50.4501";
    const longitude = this.data.get("longitude") || "30.5234";
    const platform = this.data.get("platform") || "Win32";
    const deviceMemory = this.data.get("deviceMemory") || "8";
    const hardwareConcurrency = this.data.get("hardwareConcurrency") || "4";
    const taskbarHeight = this.data.get("taskbarHeight") || "40";
    const webglVendor = this.data.get("webglVendor") || "Google Inc.";
    const webglRenderer = this.data.get("webglRenderer") || "ANGLE (Intel(R) HD Graphics 630)";
    return `{
  "li_at": "${li_at}",
  "JSESSIONID": "${JSESSIONID}",
  "userAgent": "${userAgent}",
  "viewportWidth": ${viewportWidth},
  "viewportHeight": ${viewportHeight},
  "timezone": "${timezone}",
  "locale": "${locale}",
  "screenWidth": ${screenWidth},
  "screenHeight": ${screenHeight},
  "devicePixelRatio": ${devicePixelRatio},
  "latitude": ${latitude},
  "longitude": ${longitude},
  "platform": "${platform}",
  "deviceMemory": ${deviceMemory},
  "hardwareConcurrency": ${hardwareConcurrency},
  "taskbarHeight": ${taskbarHeight},
  "webglVendor": "${webglVendor}",
  "webglRenderer": "${webglRenderer}",
  "cookies": { "li_at": "${li_at}", "JSESSIONID": "${JSESSIONID}" },
  "headers": {}
}`;
  }
}
