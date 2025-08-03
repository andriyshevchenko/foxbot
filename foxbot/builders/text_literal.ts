import { Query } from '../core'; export class TextLiteral implements Query<string>{ constructor(private readonly t:string){} async value(){ return this.t; } }
