'use strict';

function sleep(t) {
  return new Promise(r => setTimeout(r, t));
}

/**
 * hight order function to make operation rety
 *
 * @param {number} attemptsTotal
 * @param {number} firstRetryDelay - ms as unit
 */
function withRetry({ attemptsTotal = 3, firstRetryDelay = 0 } = {}) {
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
    if (attemptsMade >= attemptsTotal) {
      throw lastError;
    }
    return await run(fn);
  };

  return run;
}

module.exports = withRetry;
