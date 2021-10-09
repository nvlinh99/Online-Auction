const joi = require('joi')
const { Test, } = require('../../model')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi.object({
    msg: joi.string().required(),
  }),
})

const helloWorldHandler = (req, res) => {
  res.json({
    message: req.query.msg,
  })
}

module.exports = [
  requestValidationHandler,
  helloWorldHandler,
]
