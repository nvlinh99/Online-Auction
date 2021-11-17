const joi = require('joi')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const NotificationModel = require('../../model/notification')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      notiId: joi.number().optional().positive().invalid(null),
      readAll: joi.boolean().optional().invalid(null)
    })
    .unknown(false),
})

const readHandler = async (req, res) => {
  const { body, user } = req
  if (body.readAll) {
    await NotificationModel.updateMany({ userId: user.id, read: false }, { read: true })
  } else if (body.notiId) {
    await NotificationModel.updateOne({ userId: user.id, id: body.notiId }, { read: true })
  }

  return res.reqS({
    message: 'Thành công!'
  })
}

module.exports = [
  authMdw.authorize,
  requestValidationHandler,
  readHandler,
]
