const joi = require("joi")
const { USER_ROLE } = require("../../../constant/user")
const genRequestValidation = require("../../../middleware/gen-request-validation")
const UpgradeModel = require("../../../model/upgrade")
const UserModel = require("../../../model/user")

const requestValidationHandler = genRequestValidation({})

const handler = async (req, res) => {
  const { id } = req.params
  const body = { status: 1 }
  const existedId = await UpgradeModel.findOne({
    status: {
      $ne: 1,
    },
    expiredDate: {
      $gte: new Date(),
    },
  })
  if (!existedId) {
    return res.reqF("Yêu cầu nâng cấp không tồn tại")
  }
  const user = UserModel.findOne({
    id: existedId.userId,
    status: {
      $ne: 1,
    },
  })
  if (!user) {
    return res.reqF("Tài khoản yêu cầu nâng cấp không tồn tại")
  }
  const updatedUser = await UserModel.findOneAndUpdate(
    { id: existedId.userId },
    { $set: { role: USER_ROLE.SELLER } },
    { new: true },
  )
  const data = await UpgradeModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true },
  )
  if (!data) {
    return res.reqF("Duyệt yêu cầu nâng cấp thất bại")
  }
  data.user = updatedUser
  return res.reqS({
    category: data,
    message: "Duyệt yêu cầu nâng cấp thành công",
  })
}

module.exports = [requestValidationHandler, handler]
