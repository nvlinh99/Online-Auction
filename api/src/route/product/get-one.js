const joi = require('joi')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const CategoryModel = require('../../model/category')
const UserModel = require('../../model/user')
const BidModel = require('../../model/bid')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      productId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { params: { productId, }, } = req
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
  const [
    categoryInfo,
    sellerInfo,
    bidInfo,
  ] = await Promise.all(jobs)
  product.categoryInfo = categoryInfo
  product.sellerInfo = sellerInfo
  if (bidInfo) {
    const biderInfo = await UserModel.findOne({ id: bidInfo.userId, }).lean()
    product.biderInfo = biderInfo
  }

  return res.json({
    code: 1000,
    data: { product, },
  })
}

module.exports = [
  requestValidationHandler,
  handler,
]
