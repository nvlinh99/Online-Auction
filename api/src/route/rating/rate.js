const joi = require('joi')
const md5 = require('md5')
const RatingModel = require('../../model/rating')
const UserModel = require('../../model/user')
const NotificationModel = require('../../model/notification')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')
const { RATING_TYPE } = require('../../constant/rating')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      userId: joi.number().required().positive().invalid(null),
      type: joi.number().required().valid(RATING_TYPE.LIKE, RATING_TYPE.DISLIKE).invalid(null),
      comment: joi.string().trim().required().invalid(null)
    })
    .unknown(false),
})

const rateHandler = async (req, res) => {
  const { body, user } = req
  if (user.id === body.userId) return res.reqF('Không được đanh giá chính bản thân.')
 
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
      userId: body.userId,
      rateById: user.id,
      type: body.type,
      comment: body.comment
    }),
    UserModel.updateOne({ id: body.userId, }, userUpdateData)
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
