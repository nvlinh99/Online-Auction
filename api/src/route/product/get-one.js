const joi = require('joi')
const _ = require('lodash')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const CategoryModel = require('../../model/category')
const UserModel = require('../../model/user')
const BidModel = require('../../model/bid')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const authMdw = require('../../middleware/auth')
const genRequestValidation = require('../../middleware/gen-request-validation')
const { USER_ROLE, } = require('../../constant/user')

const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      productId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { params: { productId, }, user, } = req
  const product = await ProductModel.findOne({ id: productId, }).lean()
  if (!product) {
    return res.json({
      code: -1000,
      data: {
        message: 'Sản phẩm không tồn tại.',
      },
    }) 
  }

  const jobs = [
    CategoryModel.findOne({ id: product.categoryId, }).lean(),
    UserModel.findOne({ id: product.sellerId, }).lean(),
    BidModel.findOne({ productId: product.id, status: 0, }).sort({ price: -1, }),
  ]
  
  if (user && user.id) {
    const filter = { productId, }
    if (user.id !== product.sellerId) filter.status = 0
    jobs.push(
      BidModel.find(filter).sort({ createdAt: -1, price: -1, }).populate('bidder').lean()
    ) 
  }
  const [
    categoryInfo,
    sellerInfo,
    bidInfo,
    bidHistory,
  ] = await Promise.all(jobs)
  product.categoryInfo = categoryInfo
  product.sellerInfo = sellerInfo
  if (bidInfo) {
    const biderInfo = await UserModel.findOne({ id: bidInfo.userId, }).lean()
    product.biderInfo = biderInfo
  }

  const isNotSeller = _.get(user, 'id', null) !== product.sellerId
  _.forEach(bidHistory, (his) => {
    _.set(
      his, 
      'displayBiderName', 
      isNotSeller 
        ? `****${_.get(his, 'bidder.firstName', '')}` 
        : `${_.get(his, 'bidder.lastName', '')} ${_.get(his, 'bidder.firstName', '')}`
    )
    delete his.bidder
  })
  
  product.bidHistory = bidHistory

  return res.json({
    code: 1000,
    data: { product, },
  })
}

module.exports = [
  authMdw.authorizeOptional,
  requestValidationHandler,
  handler,
]
