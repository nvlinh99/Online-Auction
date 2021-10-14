const joi = require('joi')
const _ = require('lodash')
const moment = require('moment')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const BidModel = require('../../model/bid')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')
const policyMdw = require('../../middleware/require-role')
const { USER_ROLE, } = require('../../constant/user')

ProductModel.findOne({ id:8656268102, }).then(console.log)
const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      bidId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { params: { bidId, }, user, } = req
  
  const bid = await BidModel.findOne({ id: bidId, status: 0, }).populate('product').lean()
  if (!bid || _.get(bid,'product.sellerId', null) !== user.id) return res.reqF('Không tìm thấy lượt đấu giá.')
  if (moment(_.get(bid,'product.expiredDate', null)).isBefore(moment())) return res.reqF('Sản phẩm đã hết thời hạn đấu giá')
  if (_.get(bid,'product.winnerId', null)) return res.reqF('Sản phẩm đã kết thúc đấu giá')
  const restBid = await BidModel.find({ 
    id: { $ne: bidId, }, 
    productId: bid.productId, 
    status: 0, 
  }).sort({ price: -1, createdAt: -1, }).lean()

  const updateBidData = {
    status: 1,
  }
  const updateProdData = {
    $push: {
      bannedUser: bid.userId,
    },
    $inc: {
      totalBid: -1,
    },
  }
  
  if (bid.price === _.get(bid, 'product.currentPrice', null)) {
    updateProdData.$set = {
      currentPrice: _.get(restBid, '[0].price', _.get(bid, 'product.startPrice', bid.price)),
    }
  }
  await Promise.all([
    BidModel.updateOne({ id: bidId, }, { $set: updateBidData, }),
    ProductModel.updateOne({ id: bid.productId, }, updateProdData, { upsert: true, }),
  ])

  return res.reqS({
    message: 'Từ chối lượt đấu giá thành công.',
  })
}

module.exports = [
  authMdw.authorize,
  policyMdw(USER_ROLE.SELLER),
  requestValidationHandler,
  handler,
]
