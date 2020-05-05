const DEFAULT_ON_SUCCESS = (ctx, body) => {
  ctx.body = body
}

const DEFAULT_ON_ERROR = (ctx, raw_error, options) => {
  const {
    debug = false
  } = options

  const {
    status = 500,
    message,
    code
  } = raw_error || {}

  ctx.status = status

  const body = {}

  if (message && debug) {
    body.message = message
  }

  if (code) {
    body.code = code
  }

  ctx.body = body
}


const response = ({
  success = DEFAULT_ON_SUCCESS,
  error = DEFAULT_ON_ERROR,
  ...options
} = {}) => async (ctx, next) => {
  let data

  try {
    data = await next()
  } catch (e) {
    error(ctx, e, options)
    return
  }

  if (ctx.body) {
    // We already have a body
    return
  }

  if (ctx.status === 204) {
    // No content
    return
  }

  success(ctx, data, options)
}


module.exports = response
