const joi = require('joi')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')

const getTopProductsHandler = async (req, res) => {
  const [
    topExpireProducts,
    topRateProducts,
    topPriceProducts,
  ] = await ProductService.getTopProducts()

  res.json({
    code: 1000,
    data: {
      topExpireProducts,
      topRateProducts,
      topPriceProducts,
    },
  })
}

module.exports = [
  getTopProductsHandler,
]
