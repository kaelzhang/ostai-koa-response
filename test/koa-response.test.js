const test = require('ava')
const Koa = require('koa')
const Router = require('@koa/router')
const supertest = require('supertest')

// const log = require('util').debuglog('@ostai/koa-response')
const response = require('../src')


const create_router = ({
  status,
  code
} = {}) => {
  const router = new Router()

  router.get('/foo', () => 'ok')
  router.get('/bar', () => {
    const error = new Error('bar')

    if (status) {
      error.status = status
    }

    if (code) {
      error.code = code
    }

    throw error
  })

  router.get('/baz', () => {
    // eslint-disable-next-line no-throw-literal
    throw undefined
  })

  router.get('/quux', ctx => {
    ctx.body = {
      quux: 1
    }
  })

  router.get('/204', ctx => {
    ctx.status = 204
  })

  return router
}

const create_app = (middleware, options) => {
  const app = new Koa()

  const router = create_router(options)

  return app
  .use(middleware)
  .use(router.routes())
}


test('basic', async t => {
  const app = supertest(
    create_app(response()).callback()
  )

  t.is(
    (
      await app
      .get('/foo')
      .expect(200)
    ).text,
    'ok'
  )

  t.is(
    (
      await app
      .get('/bar')
      .expect(500)
    ).text,
    '{}'
  )

  t.is(
    (
      await app
      .get('/baz')
      .expect(500)
    ).text,
    '{}'
  )

  t.is(
    (
      await app
      .get('/quux')
      .expect(200)
    ).text,
    '{"quux":1}'
  )

  t.is(
    (
      await app
      .get('/204')
      .expect(204)
    ).text,
    ''
  )
})


test('status', async t => {
  const app = supertest(
    create_app(
      response(),
      {
        status: 401
      }
    ).callback()
  )

  t.is(
    (
      await app
      .get('/bar')
      .expect(401)
    ).text,
    '{}'
  )
})


test('debug', async t => {
  const app = supertest(
    create_app(
      response({
        debug: true
      }),
      {
        status: 401,
        code: 'BAR'
      }
    ).callback()
  )

  t.is(
    (
      await app
      .get('/bar')
      .expect(401)
    ).text,
    '{"message":"bar","code":"BAR"}'
  )
})
