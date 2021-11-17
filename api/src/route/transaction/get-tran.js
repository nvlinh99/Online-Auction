const joi = require('joi')
const ProductService = require('../../service/product-service')
const genRequestValidation = require('../../middleware/gen-request-validation')
const UserModel = require('../../model/user')
const ProductModel = require('../../model/product')
const RatingModel = require('../../model/rating')
const TransactionModel = require('../../model/transaction')
const { RATING_TYPE } = require('../../constant/rating')

const requestValidationHandler = genRequestValidation({
  query: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null)
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25 } = req.query
  const { id: userId } = req.user
  const queryObj = { $or: [{ winnerId: userId }, { sellerId: userId }] }

  const data = await TransactionModel.paginate(queryObj, {
    page,
    limit,
    populate: 'winner seller product',
  })
  if (!data) {
    return res.reqF('Lấy danh sách giao dịch thất bại')
  }
  
  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [require('../../middleware/auth').authorize, requestValidationHandler, handler]
