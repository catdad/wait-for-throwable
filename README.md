# wait-for-throwable

This method was inspired by built-in wait utilities in test frameworks, such as [`waitFor` in testing-library](https://testing-library.com/docs/dom-testing-library/api-async#waitfor), [`waitUntil` in webdriverIO](https://webdriver.io/docs/api/browser/waitUntil.html), or [`waitFor` in puppeteer](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-pagewaitforselectororfunctionortimeout-options-args). However, this module uses a standalone and generic implementation, allowing you to wait for and retry any function, both synchronous or Promise-based. You can use this in your tests directly with your favorite assertion helper.

## Install

```bash
npm install wait-for-throwable
```

## API

### `waitForThrowable(function, { interval = 5, total = 2000, count = Infinity } = {})` → `Promise`

Retries the provided method until it succeeds. The method is executed immediately, and if it fails, is retries at a defined internal until the total amount of wait time is reached. If the method succeeds at any time during the retries, the promise will resolve with the resulting value of the method. If the method continues to fail when the total timeout is reached, no more retries will occur and the promise will be rejected with the latest failure.

The arguments are:
* `method [Function]`: the method to retrym which can be a synchronous method or a promise-returning (or `async`) method
* `options [Object]` _options_: options that define the behavior of the retries
  * `interval [Number]`: the amount of time to wait between retries
  * `total [Number]`: the total amount of time to retry. If this is used along with `count`, retries will stop at whichever value is reached first.
  * `count [Number]`: the maximum number of times to retry. If this is used along with `total`, retries will stop at whichever value is reached first.
