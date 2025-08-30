import { FakePage } from "./fake-page";

export interface FakeCookie {
  name: string;
  value: string;
}

export class FakeBrowserContext {
  private readonly fakePage = new FakePage();
  private readonly storedCookies: FakeCookie[] = [];
  constructor(private readonly viewport = { width: 0, height: 0 }) {}

  newPage(): Promise<FakePage> {
    this.fakePage.setViewport(this.viewport);
    return Promise.resolve(this.fakePage);
  }

  pages(): FakePage[] {
    this.fakePage.setViewport(this.viewport);
    return [this.fakePage];
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  addCookies(cookies: FakeCookie[]): Promise<void> {
    this.storedCookies.push(...cookies);
    return Promise.resolve();
  }

  cookies(): Promise<FakeCookie[]> {
    return Promise.resolve(this.storedCookies);
  }

  addInitScript(): Promise<void> {
    return Promise.resolve();
  }

  route(): Promise<void> {
    return Promise.resolve();
  }
}
