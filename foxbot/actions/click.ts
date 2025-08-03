import { Action } from '../core'; export class Click implements Action{ constructor(private readonly el:any){} async perform(){ await (await this.el.value()).click(); } }
