const joi = require('joi')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi.object({
    msg: joi.string().required(),
  }),
})

const helloWorldHandler = (req, res) => {
  res.json({
    message: `hello world!! ${req.query.msg}`,
  })
}

module.exports = [
  requestValidationHandler,
  helloWorldHandler,
]
