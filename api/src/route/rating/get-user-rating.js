const joi = require("joi")
const ProductService = require("../../service/product-service")
const genRequestValidation = require("../../middleware/gen-request-validation")
const UserModel = require("../../model/user")
const ProductModel = require("../../model/product")
const RatingModel = require("../../model/rating")

const requestValidationHandler = genRequestValidation({
  post: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
      type: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25, type } = req.query
  const { id: userId } = req.user
  const queryObj = { userId, type }

  const data = await RatingModel.paginate(queryObj, {
    page,
    limit,
    populate: [
      "totalBids",
      {
        path: "currentBid",
        populate: "bidder",
        match: { status: 0 },
        options: {
          sort: {
            price: -1,
          },
        },
      },
    ],
  })
  if (!data) {
    return res.reqF({
      message: "Lấy danh sách  đánh giá thất bại",
    })
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page - 1,
  })
}

module.exports = [requestValidationHandler, handler]
