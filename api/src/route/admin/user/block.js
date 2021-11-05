const joi = require('joi')
const { USER_STATUS } = require('../../../constant/user')
const genRequestValidation = require('../../../middleware/gen-request-validation')
const CategoryModel = require('../../../model/category')
const ProductModel = require('../../../model/product')
const UserModel = require('../../../model/user')

const requestValidationHandler = genRequestValidation({})

const handler = async (req, res) => {
  const { id } = req.params
  const existedId = await UserModel.findOne({
    id
  })
  if (!existedId) {
    return res.reqF('Tài khoản không tồn tại')
  }
  const data = await UserModel.findOneAndUpdate(
    { id },
    { $set: { status: USER_STATUS.BLOCKED } },
    { new: true },
  )
  return res.reqS({
    message: 'Khóa tài khoản thành công',
    category: data,
  })
}

module.exports = [requestValidationHandler, handler]
