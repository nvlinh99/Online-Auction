const joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { USER_ROLE, USER_STATUS } = require('../../../constant/user')
const genRequestValidation = require('../../../middleware/gen-request-validation')
const CategoryModel = require('../../../model/category')
const UserModel = require('../../../model/user')
const configuration = require('../../../configuration')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      firstName: joi.string().trim().required().invalid('', null),
      lastName: joi.string().trim().required().invalid('', null),
      address: joi.string().trim().required().invalid('', null),
      email: joi.string().email().trim().required().invalid('', null),
      password: joi.string().trim().required().invalid('', null),
      role: joi.number().required().valid(USER_ROLE.BIDDER, USER_ROLE.SELLER)
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const data = _.cloneDeep(req.body)
  const existed = await UserModel.findOne({
    email: data.email
  })
  if (existed) {
    return res.reqF('Email đã tồn tại')
  }
  const hasedPassword = await new Promise((rsl, rjt) => {
    bcrypt.hash(data.password, configuration.bcryptSaltRounds, (err, hashed) => {
      if (err) return rjt(err)
      rsl(hashed)
    })
  })
  data.password = hasedPassword
  data.status = USER_STATUS.ACTIVE
  const createdUser = await UserModel.create(data)
  if (!data) {
    return res.reqF('Tạo tài khoản thất bại')
  }

  return res.reqS({
    user: _.pick(createdUser, ['id', 'firstName', 'lastName', 'address', 'email', 'password', 'role', 'status', 'createdAt']),
    message: 'Tạo tài khoản thành công',
  })
}

module.exports = [requestValidationHandler, handler]
