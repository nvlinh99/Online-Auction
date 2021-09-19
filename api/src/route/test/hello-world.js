const joi = require('joi')
const { Test, } = require('../../model')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi.object({
    msg: joi.string().required(),
  }),
})

const helloWorldHandler = (req, res) => {
  Test.create({
    username: 'haudeptrai',
  }).then(console.log)
  res.json({
    message: `hello world!! ${req.query.msg}`,
  })
}

module.exports = [
  requestValidationHandler,
  helloWorldHandler,
]
