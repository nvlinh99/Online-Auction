const joi = require('joi')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const NotificationModel = require('../../model/notification')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')

const requestValidationHandler = genRequestValidation({
  query: joi
    .object({
      page: joi.number().required().positive().invalid(null)
    })
    .unknown(false),
})

const N_NOTI_PER_PAGE = 10
const getManyHandler = async (req, res) => {
  const { query, user } = req
  
  const page = query.page >= 1 || 1
  const skip = (page - 1) * N_NOTI_PER_PAGE
  const limit = N_NOTI_PER_PAGE
  const notiList = await NotificationModel.find({ userId: user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

  return res.reqS({
    notiList: notiList || []
  })
}

module.exports = [
  authMdw.authorize,
  requestValidationHandler,
  getManyHandler,
]
