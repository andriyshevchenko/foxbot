import { describe, it, expect } from 'vitest';
import { LessThan } from '../foxbot/builders/less_than';
import { DaysBetween } from '../foxbot/builders/days_between';
import { Query } from '../foxbot/core/query';

class FixedDate implements Query<Date>{
  constructor(private readonly d: Date){}
  async value(){ return this.d; }
}

describe('builders', () => {
  it('LessThan compares two numbers', async () => {
    const five = { value: async () => 5 };
    const ten  = { value: async () => 10 };
    expect(await new LessThan(five as any, ten as any).value()).toBe(true);
  });

  it('DaysBetween computes whole-day delta', async () => {
    const a = new FixedDate(new Date('2024-01-01T00:00:00Z'));
    const b = new FixedDate(new Date('2024-01-11T00:00:00Z'));
    expect(await new DaysBetween(a, b).value()).toBe(10);
  });
});
