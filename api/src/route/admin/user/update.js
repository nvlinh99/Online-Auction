const joi = require('joi')
const _ = require('lodash')
const { USER_ROLE, USER_STATUS } = require('../../../constant/user')
const genRequestValidation = require('../../../middleware/gen-request-validation')
const CategoryModel = require('../../../model/category')
const UserModel = require('../../../model/user')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      firstName: joi.string().trim().required().invalid('', null),
      lastName: joi.string().trim().required().invalid('', null),
      address: joi.string().trim().required().invalid('', null),
      email: joi.string().email().trim().required().invalid('', null),
      role: joi.number().required().valid(USER_ROLE.BIDDER, USER_ROLE.SELLER),
      status: joi.number().required().valid(USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.BLOCKED)
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const data = _.clone(req.body)
  const { id } = req.params
  const existedId = await UserModel.findOne({
    id
  })
  if (!existedId) {
    return res.reqF('Tài khoản không tồn tại')
  }
  const existed = await UserModel.findOne({
    id: { $ne: id },
    email: data.email
  })
  if (existed) {
    return res.reqF('Email đã tồn tại')
  }
  const updatedData = await UserModel.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true },
  )
  if (!updatedData) {
    return res.reqF('Cập nhật thất bại')
  }

  return res.reqS({
    user: _.pick(updatedData, ['id', 'firstName', 'lastName', 'address', 'email', 'password', 'role', 'status', 'createdAt']),
    message: 'Cập nhật thàn công',
  })
}

module.exports = [requestValidationHandler, handler]
