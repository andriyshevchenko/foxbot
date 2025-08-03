import type { ElementHandle } from 'playwright';
import { Query } from '../core';
export class Element implements Query<ElementHandle<HTMLElement>>{
  constructor(private readonly locator:Query<any>){}
  async value(){ const loc=await this.locator.value(); const h=await loc.elementHandle(); if(!h) throw new Error('Element not found'); return h as ElementHandle<HTMLElement>; }
}
