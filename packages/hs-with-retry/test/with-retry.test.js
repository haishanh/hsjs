'use strict';

require('should');

const sinon = require('sinon');
const withRetry = require('..');
const setTimeoutOrig = global.setTimeout;

describe('withRetry', () => {
  let cleanups = [];
  afterEach(async () => {
    const tmp = cleanups.map(async x => await x());
    cleanups = [];
    await Promise.all(tmp);
  });

  it('should return immediately after resolving', async () => {
    const callback = sinon.spy();
    async function loremAsyncOperation() {
      callback();
    }
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    await w(loremAsyncOperation);
    callback.callCount.should.equal(1);
  });

  it('should return the result correctly', async () => {
    const callback = sinon.spy();
    async function loremAsyncOperation() {
      callback();
      return '123';
    }
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    const ret = await w(loremAsyncOperation);
    callback.callCount.should.equal(1);
    ret.should.equal('123');
  });

  it('should work with synchronous operation', async () => {
    const callback = sinon.spy();
    function loremSyncOperation() {
      callback();
      return '123';
    }
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    const ret = await w(loremSyncOperation);
    callback.callCount.should.equal(1);
    ret.should.equal('123');
  });

  it('should throw correct error', async () => {
    const callback = sinon.spy();
    async function loremAsyncOperation() {
      callback();
      throw new Error('correct-error-lol');
    }
    global.setTimeout = fn => fn();
    cleanups.push(() => (global.setTimeout = setTimeoutOrig));
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    try {
      await w(loremAsyncOperation);
    } catch (err) {
      err.message.should.equal('correct-error-lol');
    }
    callback.callCount.should.equal(10);
  });

  it('should return retry as specified', async () => {
    const callback = sinon.spy();
    async function loremAsyncOperation() {
      callback();
      throw new Error('whatever');
    }
    global.setTimeout = fn => fn();
    cleanups.push(() => (global.setTimeout = setTimeoutOrig));
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    try {
      await w(loremAsyncOperation);
    } catch (err) {
      // ignore
    }
    callback.callCount.should.equal(10);
  });

  it('should wait correctly between retries', async () => {
    const callback = sinon.spy();
    async function loremAsyncOperation() {
      callback();
      throw new Error('whatever');
    }
    const timeouts = [];
    global.setTimeout = (fn, t) => {
      timeouts.push(t);
      fn();
    };
    cleanups.push(() => (global.setTimeout = setTimeoutOrig));
    const w = withRetry({ attemptsTotal: 4, firstRetryDelay: 10 });
    try {
      await w(loremAsyncOperation);
    } catch (err) {
      // ignore
    }
    callback.callCount.should.equal(4);
    timeouts.should.eql([10, 20, 40]);
  });

  it('should return after a success retry', async () => {
    const callback = sinon.spy();
    let count = 0;
    async function loremAsyncOperation() {
      count++;
      if (count < 5) throw new Error('whatever');
      callback();
      return '123';
    }
    global.setTimeout = fn => fn();
    cleanups.push(() => (global.setTimeout = setTimeoutOrig));
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10 });
    let ret;
    try {
      ret = await w(loremAsyncOperation);
    } catch (err) {
      // ignore
    }
    ret.should.equal('123');
    count.should.equal(5);
    callback.callCount.should.equal(1);
  });

  it('shouldGiveUp should take effect', async () => {
    const callback = sinon.spy();
    let count = 0;
    async function loremAsyncOperation() {
      count++;
      if (count < 5) throw new Error('whatever');
      if (count === 5) throw new Error('foo');
      callback();
      return '123';
    }
    global.setTimeout = fn => fn();
    cleanups.push(() => (global.setTimeout = setTimeoutOrig));
    const w = withRetry({ attemptsTotal: 10, firstRetryDelay: 10, shouldGiveUp: err => err.message === 'foo' });
    let ret;
    try {
      ret = await w(loremAsyncOperation);
    } catch (err) {
      // ignore
    }
    count.should.equal(5);
    should(ret).be.undefined();
    callback.callCount.should.equal(0);
  });
});
