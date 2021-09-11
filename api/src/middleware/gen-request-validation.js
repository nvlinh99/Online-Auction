
module.exports = function (validation) {
  return async function (req, res, next) {
    if (validation.query) {
      try {
        const query = await validation.query.validateAsync(req.query)
        req.query = query
      } catch (err) {
        return res.status(400).json({
          message: `Request's query validation error: ${err.message}`,
        })
      }
    }
    if (validation.params) {
      try {
        const params = await validation.params.validateAsync(req.params)
        req.params = params
      } catch (err) {
        return res.status(400).json({
          message: `Request's params validation error: ${err.message}`,
        })
      }
    }
    if (validation.body) {
      try {
        const body = await validation.body.validateAsync(req.body)
        req.body = body
      } catch (err) {
        return res.status(400).json({
          message: `Request's body validation error: ${err.message}`,
        })
      }
    }

    return next()
  }
}
