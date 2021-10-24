const joi = require('joi')
const md5 = require('md5')
const moment  = require('moment')
const _ = require('lodash')
const { Product:ProductModel,Bid:BidModel, User: UserModel, } = require('../../model')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const socketEmitter = require('../../service/socket-service').emitter
const NotiService = require('../../service/noti-service')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      productId: joi.number().integer().positive().invalid(null),
      price:joi.number().integer().required().positive().invalid(0, null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { id: userId, } = req.user
  const { productId, price, } = req.body
  const product = await ProductModel.findOne({
    id: productId,
    status: 0,
    expiredDate: {
      $gt: new Date(),
    },
    winner: null,
  })
  if (!product) {
    return res.json({
      code:-1000,
      data:{
        message:'Sản phẩm không tồn tại',
      },
    })
  }
  if (product.bannedUser && product.bannedUser.includes(userId)) {
    return res.json({
      code: -1000,
      data: {
        message: 'Bạn không được phép đấu giá sản phẩm này',
      },
    })
  }
  let updateData = {}
  if (product.purchasePrice && product.purchasePrice <= price) {
    updateData = {
      winnerId: userId,
      status: 1,
    }
  }
  if (
    product.autoRenew
    && moment(product.expiredDate).diff(moment(), 'minutes') <= 5
  ) {
    updateData.expiredDate = moment(product.expiredDate)
      .add(10, 'minutes')
      .toDate()
  }

  if (!updateData.winnerId && price < product.currentPrice + product.stepPrice) {
    return res.json({
      code: -1000,
      data: {
        message: 'Giá không hợp lệ',
      },
    })
  }
  updateData.currentPrice = price
  const pm  = [BidModel.create({
    userId,
    productId,
    price,
  }),]
  if (!_.isEmpty(updateData)) {
    pm.push(ProductModel.updateOne({
      id:productId,
    }, { 
      $set: updateData, 
      $inc: { totalBid: 1, },
      $push: {
        biderIdList: userId
      }
    }, { upsert: true }))
  }
  const [bid, ] = await Promise.all(pm)
  res.json({
    code: 1000,
    data: {
      message: 'Đấu giá thành công',
    },
  })

  const newestProduct = await ProductModel.findOne({ id: productId, })
  const bidder = await UserModel.findOne({ id: userId, }).lean()
  bid.bidder = bidder
  NotiService.newBid(newestProduct, bid)
  socketEmitter.emit(`product-change-${productId}`, {
    product: {
      currentPrice: newestProduct.currentPrice,
      expiredDate: newestProduct.currentPrice,
      totalBid: newestProduct.totalBid,
      biderInfo: {
        id: bidder.id,
        firstName: bidder.firstName,
        lastName: bidder.lastName,
        rateTotal: bidder.rateTotal,
        rateIncrease: bidder.rateIncrease,
        rateDecrease: bidder.rateDecrease,
      },
      newBid: {
        id: bid.id,
        createdAt: bid.createdAt,
        firstName: bidder.firstName,
        lastName: bidder.lastName,
        price: bid.price,
        status: bid.status,
      },
    },
  })
}

module.exports = [
  requestValidationHandler,
  handler,
]
