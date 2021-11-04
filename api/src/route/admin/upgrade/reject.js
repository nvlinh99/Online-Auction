const genRequestValidation = require("../../../middleware/gen-request-validation")
const UpgradeModel = require("../../../model/upgrade")

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

  const data = await UpgradeModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true },
  )
  if (!data) {
    return res.reqF("Từ chối yêu cầu nâng cấp thất bại")
  }
  return res.reqS({
    category: data,
    message: "Từ chối yêu cầu nâng cấp thành công",
  })
}

module.exports = [requestValidationHandler, handler]
