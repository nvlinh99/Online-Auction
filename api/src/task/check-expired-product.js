/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const numeral = require('numeral')
const ProductModel = require('../model/product')
const BidModel = require('../model/bid')
const UserModel = require('../model/user')
const EmailService = require('../service/emailService')

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

const LIMIT = 5;

(async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const products = await ProductModel.find({
        expiredDate: {
          $lte: new Date()
        },
        status: { $in: [0] },
        winnerId: null
      }).sort({ createdAt: -1 }).limit(LIMIT).lean()
      if (_.get(products, 'length', 0) < 1) {
        await wait(60000)
      } else {
        const jobs = products.map((product) => {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (res) => {
            const winBid = await BidModel
              .findOne({ productId: product.id, status: 0 })
              .sort({ price: -1 })
              .populate('bidder')
              .lean()
            const seller = await UserModel.findOne({ id: product.sellerId }).lean()

            if (!winBid) {
              if (seller) {
                const sendEmailSellerService = new EmailService({
                  name: `${seller.firstName} ${seller.lastName}`, 
                  email: seller.email, 
                })
                sendEmailSellerService.noWinner(product.name)
              }
              await ProductModel.updateOne({ id: product.id }, { $set: { status: 2 } })
              return res()
            }

            const winnerFirstName = _.get(winBid, 'bidder.firstName', '')
            const winnerLastName = _.get(winBid, 'bidder.lastName', '')
            const winnerEmail = _.get(winBid, 'bidder.email', '')
            if (winnerEmail) {
              const sendEmailWinnerService = new EmailService({ 
                name: `${winnerFirstName} ${winnerLastName}`, 
                email: winnerEmail, 
              })
              sendEmailWinnerService.winner(
                product.name, 
                `${winnerFirstName} ${winnerLastName}`,
                `${numeral(winBid.price).format('0,0')} VND`
              )
            }
            
            if (seller) {
              const sendEmailSellerService = new EmailService({
                name: `${seller.firstName} ${seller.lastName}`, 
                email: seller.email, 
              })
              sendEmailSellerService.sendToSellerHasWinner(
                product.name, 
                `${winnerFirstName} ${winnerLastName}`, 
                `${numeral(winBid.price).format('0,0')} VND`
              )
            }
            await ProductModel.updateOne({ id: product.id }, { $set: { winnerId: winBid.userId } })
            return res()
          })
        })
        await Promise.all(jobs)
        
        await wait(10000)
      }
    } catch (err) {
      await wait(10000)
    }
  }
})()
