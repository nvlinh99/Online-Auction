const joi = require('joi')
const genRequestValidation = require('../../middleware/gen-request-validation')
const ProductModel = require('../../model/product')
const RatingModel = require('../../model/rating')
const UserModel = require('../../model/user')

exports.requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      comment: joi.string().trim().required().invalid('', null),
    }),
})

exports.ratingUp = async (req, res) => {
  const { user, } = req
  const { bidderId, } = req.params
  const { comment, } = req.body
  const isBuy = await ProductModel.findOne({ sellerId: user.id, bidderId, status: 1, })
  if (!isBuy) {
    return res.status(400).json({
      code: -1000,
      message: 'Bạn không thể đánh giá!',
    })
  }

  const vote = await RatingModel.create({
    userId: bidderId,
    rateById: user.id,
    comment,
  })

  if (!vote) {
    return res.status(400).json({
      code: -1000,
      message: 'Có lỗi xảy ra!',
    })
  }
  const thumbsUp = 1
  await UserModel.findOneAndUpdate({ id: bidderId, }, { $inc: { rateIncrease: thumbsUp, }, })
  return res.status(200).json({
    code: 1000,
    message: 'Đánh giá thành công!',
  })
}

exports.ratingDown = async (req, res) => {
  const { user, } = req
  const { bidderId, } = req.params
  const { comment, } = req.body
  const isBuy = await ProductModel.findOne({ sellerId: user.id, bidderId, status: 1, })
  if (!isBuy) {
    return res.status(400).json({
      code: -1000,
      message: 'Bạn không thể đánh giá!',
    })
  }

  const vote = await RatingModel.create({
    userId: bidderId,
    rateById: user.id,
    comment,
  })

  if (!vote) {
    return res.status(400).json({
      code: -1000,
      message: 'Có lỗi xảy ra!',
    })
  }
  const thumbsDown = -1
  await UserModel.findOneAndUpdate({ id: bidderId, }, { $inc: { rateDecrease: thumbsDown, }, })
  return res.status(200).json({
    code: 1000,
    message: 'Đánh giá thành công!',
  })
}

exports.cancelTransaction = async (req, res) => {
  const { user, } = req
  const { bidderId, } = req.params
  const isBuy = await ProductModel.findOne({ sellerId: user.id, bidderId, status: 1, })
  if (!isBuy) {
    return res.status(400).json({
      code: -1000,
      message: 'Bạn không thể đánh giá!',
    })
  }

  const vote = await RatingModel.create({
    userId: bidderId,
    rateById: user.id,
    comment: 'Người thắng không thanh toán!',
  })

  if (!vote) {
    return res.status(400).json({
      code: -1000,
      message: 'Có lỗi xảy ra!',
    })
  }
  const thumbsDown = -1
  await UserModel.findOneAndUpdate({ id: bidderId, }, { $inc: { rateDecrease: thumbsDown, }, })
  return res.status(200).json({
    code: 1000,
    message: 'Đánh giá thành công!',
  })
}

// module.exports = [
//   requestValidationHandler,
//   ratingUp,
//   ratingDown,
//   cancelTransaction,
// ]
