const _ = require('lodash')
const moment = require('moment')
const NotificationModel = require('../model/notification')
const ProductModel = require('../model/product')
const BidModel = require('../model/bid')
const UserModel = require('../model/user')
const { NOTI_TYPE } = require('../constant/noti')
const socketEmitter = require('./socket-service').emitter

exports.insertAndPushNoti = async function (data) {
  const createdNoti = await NotificationModel.create(data)
  socketEmitter.emit(`new-noti-${createdNoti.userId}`, {
    noti: createdNoti
  })
}

exports.newBid = async function (product, bid) {
  exports.insertAndPushNoti({
    userId: product.sellerId,
    type: NOTI_TYPE.SELLER_NEW_BID,
    title: 'Sản phẩm của bạn có lượt đấu giá mới!',
    data: { 
      biderName: `${_.get(bid, 'bidder.lastName', '')} ${_.get(bid, 'bidder.firstName', '')}`,
      bidPrice: bid.price,
      productName: product.name,
      productId: product.id
    }
  })

  const ortherBidList = await BidModel
    .find(
      {
        productId: product.id,
        status: 0,
        userId: { $ne: bid.userId }
      }
    )
    .populate('bidder').lean()

  _.forEach(ortherBidList, (ortherBid) => {
    exports.insertAndPushNoti({
      userId: ortherBid.userId,
      type: NOTI_TYPE.BIDER_NEW_BID,
      title: 'Sản phẩm bạn đấu giá đã có lượt đấu giá mới!',
      data: { 
        biderName: `****${_.get(bid, 'bidder.firstName', '')}`,
        bidPrice: bid.price,
        productName: product.name,
        productId: product.id
      }
    })
  })
}
