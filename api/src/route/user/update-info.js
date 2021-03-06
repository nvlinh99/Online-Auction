const joi = require('joi')
const UserModel = require('../../model/user')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  body: joi.object({
    firstName: joi.string().trim().required().invalid('', null),
    lastName: joi.string().trim().required().invalid('', null),
    address: joi.string().trim().required().invalid('', null),
    email: joi.string().trim().required().invalid('', null).email(),
    dateOfBirth: joi.date().invalid('').default(null),
  }).unknown(false),
})

const updateHandler = async (req, res) => {
  const user = req.user
  const data = req.body

  await UserModel.findOneAndUpdate({ id: user.id, }, {
    $set: {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
    },
  }, { returnOriginal: false, })

  res.json({
    code: 1000,
    data: {
      message: 'Cập nhật thông tin thành công.',
    },
  })
}

module.exports = [
  requestValidationHandler,
  updateHandler,
]
