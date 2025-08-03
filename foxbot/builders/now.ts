import { Query } from '../core'; export class Now implements Query<Date>{ async value(){ return new Date(); } }
