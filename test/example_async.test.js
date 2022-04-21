// callback
const asyncCallback = (cb) => {
// eslint-disable-next-line indent
      setTimeout(() => {
    // eslint-disable-next-line indent
        cb(true);
    // eslint-disable-next-line indent
      }, 1000);
// eslint-disable-next-line indent
    };

// promises
// eslint-disable-next-line no-promise-executor-return
const asyncPromise = () => new Promise((resolve) => resolve(true));

describe('async code', () => {
  test('example of async with callback', (done) => {
    asyncCallback((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  // eslint-disable-next-line arrow-body-style
  test('example of async with promises', () => {
  // eslint-disable-next-line arrow-parens
    return asyncPromise().then(result => {
      expect(result).toBe(true);
    });
  });

  test('example of async with async await', async () => {
    const result = await asyncPromise();
    expect(result).toBe(true);
  });
});
