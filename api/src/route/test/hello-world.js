const Joi = require('joi')
const RequestValidation = require('../../middleware/request-validation')

const preHandler = [
  RequestValidation({
    query: Joi.object({
      msg: Joi.string().required(),
    }),
  }),
]

const handler = (req, res) => {
  res.json({
    message: `hello world!! ${req.query.msg}`,
  })
}

module.exports = {
  preHandler,
  handler,
}
