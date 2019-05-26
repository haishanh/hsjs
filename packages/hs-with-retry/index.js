'use strict';

function sleep(t) {
  return new Promise(r => setTimeout(r, t));
}

/**
 * hight order function to make operation rety
 *
 * @param {number} attemptsTotal
 * @param {number} firstRetryDelay - ms as unit
 * @param {function} shouldGiveUp - takes error as argument and return a boolean
 */
function withRetry({
  attemptsTotal = 3,
  firstRetryDelay = 0,
  shouldGiveUp = () => false
} = {}) {
  let lastError;
  let attemptsMade = 0;
  const run = async fn => {
    try {
      if (attemptsMade > 0) {
        const t = 2 ** (attemptsMade - 1) * firstRetryDelay;
        await sleep(t);
      }
      return await fn();
    } catch (err) {
      lastError = err;
    }
    attemptsMade++;
    if (shouldGiveUp(lastError)) {
      throw lastError;
    }
    if (attemptsMade >= attemptsTotal) {
      throw lastError;
    }
    return await run(fn);
  };

  return run;
}

module.exports = withRetry;
