const joi = require('joi')
const md5 = require('md5')
const RatingModel = require('../../model/rating')
const UserModel = require('../../model/user')
const ProductModel = require('../../model/product')
const NotificationModel = require('../../model/notification')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')
const { RATING_TYPE } = require('../../constant/rating')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      productId: joi.number().required().positive().invalid(null),
      type: joi.number().required().valid(RATING_TYPE.LIKE, RATING_TYPE.DISLIKE).invalid(null),
      comment: joi.string().trim().required().invalid(null)
    })
    .unknown(false),
})

const rateHandler = async (req, res) => {
  const { body, user } = req
 
  const product = await ProductModel.findOne({ 
    id: body.productId, 
    winnerId: { $ne: null },
  })

  if (!product || (user.id !== product.sellerId && user.id !== product.winnerId)) return res.reqF('Thêm đánh giá thất bại.')

  const ratedUserId = product.winnerId === user.id ? product.sellerId : product.winnerId
  const existsRate = await RatingModel.findOne({
    userId: ratedUserId,
    rateById: user.id,
    productId: product.id,
  })
  if (existsRate) return res.reqF('Bạn đã đánh giá người này rồi.')

  const userUpdateData = {}
  if (body.type === RATING_TYPE.LIKE) {
    userUpdateData.$inc = { 
      rateTotal: 1,
      rateIncrease: 1
    }
  } else {
    userUpdateData.$inc = { 
      rateTotal: -1,
      rateDecrease: 1
    }
  }

  const [ newRate, ] = await Promise.all([
    RatingModel.create({
      userId: ratedUserId,
      rateById: user.id,
      productId: product.id,
      type: body.type,
      comment: body.comment
    }),
    UserModel.updateOne({ id: ratedUserId, }, userUpdateData)
  ])

  return res.reqS({
    message: 'Thành công!',
    rating: newRate
  })
}

module.exports = [
  authMdw.authorize,
  requestValidationHandler,
  rateHandler,
]
