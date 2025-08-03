import type { Locator as PwLocator } from 'playwright';
import { Query } from '../core';
import { PageSession } from './session';
export class Locator implements Query<PwLocator>{
  constructor(private readonly session:PageSession, private readonly selector:string){}
  async value(){ if(!this.session.page) throw new Error('Session page not started.'); return this.session.page.locator(this.selector); }
}
