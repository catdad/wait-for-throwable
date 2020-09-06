const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const waitForThrowable = async (func, { interval = 5, total = 2000, count = Infinity } = {}) => {
  const end = Date.now() + total;
  let c = 0;

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    c += 1;

    try {
      return await func();
    } catch (e) {
      if (!(Date.now() < end && c < count)) {
        throw e;
      }
    }

    await sleep(interval);
  }
};

module.exports = waitForThrowable;
