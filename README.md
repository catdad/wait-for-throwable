# wait-for-throwable

[![gitlab-actions][gitlab-actions.svg]][gitlab-actions.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[gitlab-actions.svg]: https://github.com/catdad/wait-for-throwable/actions/workflows/ci.yml/badge.svg
[gitlab-actions.link]: https://github.com/catdad/wait-for-throwable/actions/workflows/ci.yml?query=branch%3Amaster
[npm-downloads.svg]: https://img.shields.io/npm/dm/wait-for-throwable.svg
[npm.link]: https://www.npmjs.com/package/wait-for-throwable
[npm-version.svg]: https://img.shields.io/npm/v/wait-for-throwable.svg

This method was inspired by built-in wait utilities in test frameworks, such as [`waitFor` in testing-library](https://testing-library.com/docs/dom-testing-library/api-async#waitfor), [`waitUntil` in webdriverIO](https://webdriver.io/docs/api/browser/waitUntil.html), or [`waitFor` in puppeteer](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-pagewaitforselectororfunctionortimeout-options-args). However, this module uses a standalone and generic implementation, allowing you to wait for and retry any function, both synchronous or Promise-based. You can use this in your tests directly with your favorite assertion helper.

## Install

```bash
npm install wait-for-throwable
```

## API

### `waitForThrowable()` → `Promise`

Retries the provided method until it succeeds. The method is executed immediately, and if it fails, is retries at a defined internal until the total amount of wait time is reached. If the method succeeds at any time during the retries, the promise will resolve with the resulting value of the method. If the method continues to fail when the total timeout is reached, no more retries will occur and the promise will be rejected with the latest failure.

The arguments are:
* `method {Function}`: the method to retry, which can be a synchronous method or a promise-returning (or `async`) method
* `[options] {Object}`: options that define the behavior of the retries. Everything is optional.
  * `[interval = 5] {Number}`: the amount of time to wait between retries
  * `[total = 2000] {Number}`: the total amount of time to retry. If this is used along with `count`, retries will stop at whichever value is reached first.
  * `[count = Infinity] {Number}`: the maximum number of times to retry. If this is used along with `total`, retries will stop at whichever value is reached first.
