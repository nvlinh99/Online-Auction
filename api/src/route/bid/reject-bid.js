const joi = require('joi')
const _ = require('lodash')
const moment = require('moment')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const BidModel = require('../../model/bid')
const UserModel = require('../../model/user')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')
const policyMdw = require('../../middleware/require-role')
const { USER_ROLE, } = require('../../constant/user')
const socketEmitter = require('../../service/socket-service').emitter
const NotiService = require('../../service/noti-service')
const EmailService = require('../../service/emailService')

const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      bidId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { params: { bidId, }, user, } = req
  
  const bid = await BidModel.findOne({ id: bidId, status: 0, }).populate('product bidder').lean()
  if (!bid || _.get(bid,'product.sellerId', null) !== user.id) return res.reqF('Không tìm thấy lượt đấu giá.')
  if (moment(_.get(bid,'product.expiredDate', null)).isBefore(moment())) return res.reqF('Sản phẩm đã hết thời hạn đấu giá')
  if (_.get(bid,'product.winnerId', null)) return res.reqF('Sản phẩm đã kết thúc đấu giá')
  const restBid = await BidModel.find({ 
    id: { $ne: bidId, }, 
    userId: { $ne: bid.userId, },
    productId: bid.productId, 
    status: 0, 
  }).sort({ price: -1, createdAt: -1, }).lean()

  const updateBidData = {
    status: 1,
  }

  const descBidCount = await BidModel.countDocuments({ userId: bid.userId , productId: bid.productId, status: 0, })
  const updateProdData = {
    $push: {
      bannedUser: bid.userId,
    },
    $inc: {
      totalBid: -descBidCount,
    },
  }
  
  updateProdData.$set = {
    currentPrice: _.get(restBid, '[0].price', _.get(bid, 'product.startPrice', bid.price)),
  }
  
  await Promise.all([
    BidModel.updateMany({ productId: bid.productId, userId: bid.userId, }, { $set: updateBidData, }),
    ProductModel.updateOne({ id: bid.productId, }, updateProdData, { upsert: true, }),
  ])

  res.reqS({
    message: 'Từ chối lượt đấu giá thành công.',
  })

  const product = await ProductModel.findOne({ id: bid.productId, }).lean()
  const bidHistory = await BidModel.find({ productId: bid.productId, status: 0, }).sort({ price: -1, createdAt: -1, }).populate('bidder').lean()
  const biderInfo = _.get(bidHistory, '[0].bidder')
  _.forEach(bidHistory, (his) => {
    _.set(
      his, 
      'displayBiderName',
      `****${_.get(his, 'bidder.firstName', '')}` 
    )
    delete his.bidder
  })
  NotiService.rejectBid(product, bid.bidder)
  socketEmitter.emit(`product-change-${bid.productId}`, {
    product: {
      currentPrice: product.currentPrice,
      totalBid: product.totalBid,
      biderInfo,
      bidHistory,
    },
  })

  const bidderEmail = _.get(bid, 'bidder.email', '')
  if (bidderEmail) {
    const bidderFirstName = _.get(bid, 'bidder.firstName', '')
    const bidderLastName = _.get(bid, 'bidder.lastName', '')
    const bidderEmailService = new EmailService({
      name: `${bidderFirstName} ${bidderLastName}`, 
      email: bidderEmail, 
    })
    UserModel.findOne({ id: product.sellerId }).lean().then((seller) => {
      if (seller) {
        bidderEmailService.reject(`${seller.firstName} ${seller.lastName}`, product.name)
      }
    })
  }
}

module.exports = [
  authMdw.authorize,
  policyMdw(USER_ROLE.SELLER),
  requestValidationHandler,
  handler,
]
