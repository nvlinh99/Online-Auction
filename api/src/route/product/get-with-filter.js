const joi = require('joi')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      categoryId: joi.number().integer().positive().invalid(null),
      text: joi.string().invalid('', null),
      page: joi.number().required().positive().invalid(null),
      sort: joi.object({
        createdAt: joi.number().integer().invalid(null),
        expiredDate: joi.number().integer().invalid(null),
        currentPrice: joi.number().integer().invalid(null),
      }).invalid(null).default({}),
    })
    .unknown(false),
})

const getProductsHandler = async (req, res) => {
  const { body, } = req
  const filter = {}
  filter.page = body.page || 1
  if (body.text) filter.textSearch = body.text
  if (body.categoryId) filter.categoryId = body.categoryId

  const data = await ProductService.getProductsWithPaging(filter, body.sort)

  return res.json({
    code: 1000,
    data,
  })
}

module.exports = [
  requestValidationHandler,
  getProductsHandler,
]
