import { describe, it, expect } from 'vitest';
import { Action } from '../foxbot/core/action';
import { When } from '../foxbot/actions/when';
import { Sequence } from '../foxbot/actions/sequence';

class ProbeAction implements Action{
  constructor(private readonly log: string[], private readonly msg: string){}
  async perform(){ this.log.push(this.msg); }
}

describe('actions composition', () => {
  it('Sequence runs in order', async () => {
    const log: string[] = [];
    const seq = new Sequence([
      new ProbeAction(log, 'a'),
      new ProbeAction(log, 'b'),
      new ProbeAction(log, 'c')
    ]);
    await seq.perform();
    expect(log).toEqual(['a','b','c']);
  });

  it('When executes inner action only if predicate is true', async () => {
    const log: string[] = [];
    const trueQuery = { value: async () => true };
    const falseQuery = { value: async () => false };
    await new When(trueQuery as any, new ProbeAction(log, 'hit')).perform();
    await new When(falseQuery as any, new ProbeAction(log, 'miss')).perform();
    expect(log).toEqual(['hit']);
  });
});
