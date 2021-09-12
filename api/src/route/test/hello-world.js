const joi = require('joi')
const { Account, } = require('../../model')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi.object({
    msg: joi.string().required(),
  }),
})

const helloWorldHandler = (req, res) => {
  Account.findOne({
    where: {
      id: 123,
    },
  }).then((ac) => console.log(ac.id, ac.email, ac.fullname, ac.address))
  res.json({
    message: `hello world!! ${req.query.msg}`,
  })
}

module.exports = [
  requestValidationHandler,
  helloWorldHandler,
]
