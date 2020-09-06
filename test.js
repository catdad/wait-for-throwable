/* eslint-env mocha */

const { expect } = require('chai');
const sinon = require('sinon');
const safe = require('safe-await');

const lib = require('./');

describe('wait-for-throwable', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it('succeeds first try (on the leading edge) if it does not throw', async () => {
    const func = sinon.fake();

    await lib(func);

    expect(func.callCount).to.equal(1);
  });

  it('waits for a promise-retuning function', async () => {
    const func = sinon.fake(() => new Promise(r => setTimeout(r, 18)));

    const promise = lib(func);

    expect(func.callCount).to.equal(1);

    await clock.tickAsync(18);

    await promise;

    expect(func.callCount).to.equal(1);
  });

  it('returns the result of the function being awaited', async () => {
    const expected = Math.random();
    const func = sinon.fake(() => expected);

    const actual = await lib(func);

    expect(actual).to.equal(expected);
  });

  it('retries when the method throws', async () => {
    let count = 0;

    const func = sinon.fake(() => {
      count += 1;

      if (count === 3) {
        return;
      }

      throw new Error('it failed');
    });

    const promise = lib(func);

    expect(func.callCount).to.equal(1);

    await clock.tickAsync(5);

    expect(func.callCount).to.equal(2);

    await clock.tickAsync(5);

    expect(func.callCount).to.equal(3);

    await promise;

    expect(func.callCount).to.equal(3);
  });

  it('rethrows the last error if the default maximum time is reached', async () => {
    let c = 0;

    const func = sinon.fake(() => {
      throw new Error(`pineapples ${++c}`);
    });

    const promise = lib(func);

    const [[err]] = await Promise.all([
      safe(promise),
      clock.tickAsync(2010)
    ]);

    expect(err).to.be.instanceOf(Error).and.to.have.property('message', `pineapples ${func.callCount}`);
  });

  it('rethrows the last rejected reason if the default maximum time is reached', async () => {
    let c = 0;

    const func = sinon.fake(() => {
      return new Promise((r, j) => setTimeout(() => j(`${++c}`, 1000)));
    });

    const promise = lib(func);

    const [[err]] = await Promise.all([
      safe(promise),
      clock.tickAsync(2010)
    ]);

    expect(err).to.equal(`${func.callCount}`);
  });

  it('can wait a custom amount of time', async () => {
    const func = sinon.fake(() => {
      throw new Error('kiwis');
    });

    const promise = lib(func, { total: 123 });

    expect(func.callCount).to.equal(1);

    const [[err]] = await Promise.all([
      safe(promise),
      (async () => {
        await clock.tickAsync(5);
        expect(func.callCount).to.equal(2);
        await clock.tickAsync(5);
        expect(func.callCount).to.equal(3);

        await clock.tickAsync(123 - 10 + 5);
      })()
    ]);

    expect(err).to.be.instanceOf(Error).and.to.have.property('message', 'kiwis');

  });

  it('can wait a custom interval between retries', async () => {
    const func = sinon.fake(() => {
      throw new Error('strawberries');
    });

    const promise = lib(func, { interval: 123 });

    expect(func.callCount).to.equal(1);

    for (let count of [2, 3]) {
      await clock.tickAsync(122);

      expect(func.callCount).to.equal(count - 1);

      await clock.tickAsync(1);

      expect(func.callCount).to.equal(count);
    }

    const [[err]] = await Promise.all([
      safe(promise),
      clock.tickAsync(2010)
    ]);

    expect(err).to.be.instanceOf(Error).and.to.have.property('message', 'strawberries');
  });

  it('can retry a predefined number of times', async () => {
    const func = sinon.fake(() => {
      throw new Error('oranges');
    });

    const promise = lib(func, { count: 8 });

    const [[err]] = await Promise.all([
      safe(promise),
      clock.tickAsync(2010)
    ]);

    expect(func.callCount).to.equal(8);
    expect(err).to.be.instanceOf(Error).and.to.have.property('message', 'oranges');
  });
});
