import { chromium, Browser, Page } from 'playwright';
export class PageSession{
  private browser?:Browser; public page?:Page;
  constructor(private readonly headless:boolean=true){}
  async start(){ this.browser=await chromium.launch({headless:this.headless}); this.page=await this.browser.newPage(); }
  async stop(){ await this.browser?.close(); }
}
