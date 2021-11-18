const joi = require('joi')
const md5 = require('md5')
const numeral = require('numeral')
const moment  = require('moment')
const _ = require('lodash')
const { Product:ProductModel,Bid:BidModel, User: UserModel, Transaction: TransactionModel } = require('../../model')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const socketEmitter = require('../../service/socket-service').emitter
const NotiService = require('../../service/noti-service')
const { USER_STATUS } = require('../../constant/user')
const SendEmailService = require('../../service/emailService')

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
    status: 0
  })
  if (!product) {
    return res.json({
      code:-1000,
      data:{
        message:'Sản phẩm không tồn tại',
      },
    })
  }
  if (product.winnerId) {
    return res.reqF('Sản phẩm đã có người đấu giá thắng.')
  }
  if (moment(product.expiredDate).isSameOrBefore(moment())) {
    return res.reqF('Sản phẩm đã hết thời gian đấu giá.')
  }
  
  if (product.bannedUser && product.bannedUser.includes(userId)) {
    return res.json({
      code: -1000,
      data: {
        message: 'Bạn không được phép đấu giá sản phẩm này',
      },
    })
  }

  const userInfo = await UserModel.findOne({ id: userId, status: USER_STATUS.ACTIVE }).lean()
  if (userInfo.rateIncrease === 0 && userInfo.rateDecrease === 0) {
    if (!product.allowNewUser) { return res.reqF('Bạn cần điểm đánh giá ít nhất là 80% để đâu giá sản phẩm này.') }
  } else if ((userInfo.rateIncrease / (userInfo.rateIncrease + userInfo.rateDecrease)) < 0.8) {
    return res.reqF('Bạn cần điểm đánh giá ít nhất là 80% để đâu giá sản phẩm này.')
  }

  let updateData = {}
  if (product.purchasePrice && product.purchasePrice <= price) {
    updateData = {
      winnerId: userId,
      status: 2,
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
  const pm  = [
    BidModel.create({
      userId,
      productId,
      price,
    }),
  ]
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
  if (updateData.winnerId) {
    pm.push(TransactionModel.create({
      sellerId: product.sellerId,
      winnerId: updateData.winnerId,
      productId: product.id,
    }))
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
      expiredDate: newestProduct.expiredDate,
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

  const seller = await UserModel.findOne({ id: newestProduct.sellerId }).lean()
  if (newestProduct.winnerId === bidder.id) {
    const winner = bidder
    const sendEmailWinnerService = new SendEmailService({ 
      name: `${winner.firstName} ${winner.lastName}`, 
      email: winner.email, 
    })
    sendEmailWinnerService.winner(
      newestProduct.name, 
      `${winner.firstName} ${winner.lastName}`,
      `${numeral(newestProduct.currentPrice).format('0,0')} VND`
    )
    
    const sendEmailSellerService = new SendEmailService({
      name: `${seller.firstName} ${seller.lastName}`, 
      email: seller.email, 
    })
    sendEmailSellerService.sendToSellerHasWinner(
      newestProduct.name, 
      `${winner.firstName} ${winner.lastName}`, 
      `${numeral(newestProduct.currentPrice).format('0,0')} VND`
    )
  } else {
    const sendEmailBidderService = new SendEmailService({ 
      name: `${bidder.firstName} ${bidder.lastName}`, 
      email: bidder.email, 
    })
    sendEmailBidderService.newBid(
      'Bạn', 
      newestProduct.name,
      `${numeral(bid.price).format('0,0')} VND`,
      newestProduct.id,
    )

    const sendEmailSellerService = new SendEmailService({
      name: `${seller.firstName} ${seller.lastName}`, 
      email: seller.email, 
    })
    sendEmailSellerService.sendToSellerNewBid(
      `${bidder.firstName} ${bidder.lastName}`, 
      newestProduct.name, 
      `${numeral(bid.price).format('0,0')} VND`
    )

    const lastBid = await BidModel.findOne({ 
      id: { $ne: bid.id, }, 
      userId: { $ne: bid.userId, },
      productId: bid.productId, 
      status: 0, 
    }).sort({ price: -1, createdAt: -1, }).populate('bidder').lean()
    const lastBidderEmail = _.get(lastBid, 'bidder.email', '')
    if (lastBidderEmail) {
      const lastBidderFirstName = _.get(lastBid, 'bidder.firstName', '')
      const lastBidderLastName = _.get(lastBid, 'bidder.lastName', '')
      const sendEmailLastBidderService = new SendEmailService({ 
        name: `${lastBidderFirstName} ${lastBidderLastName}`, 
        email: lastBidderEmail, 
      })
      sendEmailLastBidderService.newBid(
        `${bidder.firstName} ${bidder.lastName}`, 
        newestProduct.name,
        `${numeral(bid.price).format('0,0')} VND`,
        newestProduct.id,
      )
    } else {
      console.log('NO LAST BIDDER')
    }
  }
}

module.exports = [
  requestValidationHandler,
  handler,
]
