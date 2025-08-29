import { Query } from "#foxbot/core/query";

/**
 * Authenticated test session data generator implementing Query<string>.
 * Generates session data with cookies for authenticated session testing.
 */
export class AuthenticatedTestSessionData implements Query<string> {
  constructor(private readonly data: Map<string, string>) {}

  async value(): Promise<string> {
    const r = Math.random().toString(36).substring(2, 10);
    const li_at = this.data.get("li_at") || `тест_li_at_${r}`;
    const JSESSIONID = this.data.get("JSESSIONID") || `테스트_session_${r}`;
    const userAgent = this.data.get("userAgent") || "TestAgent/1.0";
    const viewportWidth = this.data.get("viewportWidth") || "1920";
    const viewportHeight = this.data.get("viewportHeight") || "1080";
    const timezone = this.data.get("timezone") || "UTC";
    const locale = this.data.get("locale") || "en-US";
    const cookiesJson = `{"name":"li_at","value":"${li_at}","domain":".linkedin.com","path":"/","secure":true,"httpOnly":true},{"name":"JSESSIONID","value":"${JSESSIONID}","domain":".linkedin.com","path":"/","secure":true,"httpOnly":true},{"name":"追加_cookie","value":"値_${r}","domain":".linkedin.com","path":"/","secure":true,"httpOnly":false},{"name":"дополнительный","value":"значение_${r}","domain":".linkedin.com","path":"/","secure":true,"httpOnly":false}`;
    return `{
    "li_at": "${li_at}",
    "JSESSIONID": "${JSESSIONID}",
    "userAgent": "${userAgent}",
    "viewportWidth": ${viewportWidth},
    "viewportHeight": ${viewportHeight},
    "timezone": "${timezone}",
    "locale": "${locale}",
    "cookies": [${cookiesJson}],
    "httpHeaders": {}
  }`;
  }
}
