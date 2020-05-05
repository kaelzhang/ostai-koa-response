[![Build Status](https://travis-ci.org/kaelzhang/ostai-koa-response.svg?branch=master)](https://travis-ci.org/kaelzhang/ostai-koa-response)
[![Coverage](https://codecov.io/gh/kaelzhang/ostai-koa-response/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/ostai-koa-response)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/ostai-koa-response?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/ostai-koa-response)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/@ostai/koa-response.svg)](http://badge.fury.io/js/@ostai/koa-response)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/@ostai/koa-response.svg)](https://www.npmjs.org/package/@ostai/koa-response)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/ostai-koa-response.svg)](https://david-dm.org/kaelzhang/ostai-koa-response)
-->

# @ostai/koa-response

Response middleware for koa that will handle response body and errors.

This module is designed to standardize server response structure.

## Install

```sh
$ npm i @ostai/koa-response
```

## Usage

```js
const Koa = require('koa')
const Router = require('@koa/router')

const response = require('@ostai/koa-response')

const app = new Koa()
const router = new Router()

router.get('/foo', () => 'ok')

router.get('/bar', () => {
  const error = new Error('bar')
  error.status = 401
  throw error
})


app
.use(
  response({
    debug: true
  })
)
.use(router.routes())
.use(router.allowedMethods())


app.listen(8888)
```

```sh
> curl http://localhost:8888/foo

# http 200
# ok
```

```sh
> curl http://localhost:8888/bar

# http 401
# {"message":"bar"}
```

## response(options?): Function

- **options?** `Object`
  - **error?** `Function(ctx, error, rest): void` the method to handle error
  - **success?** `Function(ctx, body, rest): void` the method to handle success
  - **...rest?** `Object`
    - **debug** `boolean=false` Which is used by the default value of `options.error`. By default, if `debug` is `false`, error response will not contain `message`.

Returns `Function` the middleware function.

## License

[MIT](LICENSE)
