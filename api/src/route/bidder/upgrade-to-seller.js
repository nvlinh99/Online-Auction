const joi = require('joi')
const moment  = require('moment')
const _ = require('lodash')
const { Upgrade:UpgradeToSellerModel, } = require('../../model')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
     
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { id: userId, } = req.user
  const data = await UpgradeToSellerModel.create({
    userId,
    status:0,
    expiredDate:moment().add(7,"days").toDate(),
  })
  if (!data) {
    return  res.reqF("Yêu cầu trở thành nhà bán hàng của bạn thất bại, vui lòng thử lại sau!")
  }
  res.reqS({
    message: 'Yêu cầu trở thành nhà bán hàng của bạn đang được sử lý và sẽ bị huỷ nếu không được duyệt trong 7 ngày',
  })
}

module.exports = [
  requestValidationHandler,
  handler,
]
