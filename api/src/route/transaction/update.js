const joi = require('joi')
const ProductService = require('../../service/product-service')
const genRequestValidation = require('../../middleware/gen-request-validation')
const UserModel = require('../../model/user')
const ProductModel = require('../../model/product')
const RatingModel = require('../../model/rating')
const TransactionModel = require('../../model/transaction')
const { RATING_TYPE } = require('../../constant/rating')

const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      tranId: joi.number().required().integer().positive().invalid(null)
    })
    .unknown(false),
  body: joi
    .object({
      status: joi.number().required().integer().valid(1, 2)
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { tranId } = req.params
  const { status } = req.body
  const { id: userId } = req.user

  const tran = await TransactionModel.findOne({ 
    id: tranId,
    sellerId: userId,
    status: 0,
  })
  if (!tran) {
    return res.reqF('Không tìm tháy giao dịch!')
  }

  const jobs = [
    TransactionModel.updateOne({ id: tranId }, { $set: { status } })
  ]
  if (status === 2) {
    const rate = await RatingModel.findOne({
      userId: tran.winnerId,
      rateById: userId,
      productId: tran.productId,
    })
    if (!rate) {
      jobs.push(RatingModel.create({
        userId: tran.winnerId,
        rateById: userId,
        productId: tran.productId,
        type: RATING_TYPE.DISLIKE,
        comment: 'Người thắng không thanh toán.',
      }))
    }
  }
  
  await Promise.all(jobs)
  return res.reqS({
    message: 'Thành công.'
  })
}

module.exports = [require('../../middleware/auth').authorize, requestValidationHandler, handler]
