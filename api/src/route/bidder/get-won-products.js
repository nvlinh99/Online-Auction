const joi = require("joi")
const ProductService = require("../../service/product-service")
const genRequestValidation = require("../../middleware/gen-request-validation")
const UserModel = require("../../model/user")
const ProductModel = require("../../model/product")
const WatchlistModel = require("../../model/watchlist")

const requestValidationHandler = genRequestValidation({
  query: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25 } = req.query
  const { id: winnerId } = req.user
  const data = await ProductModel.paginate(
    { winnerId },
    {
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
    },
  )
  if (!data) {
    return res.reqF({
      message: "Lấy danh sách  sản phẩm thất bại",
    })
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs.map((i) => i.product),
    totalPages: data.totalPages,
    currentPage: data.page - 1,
  })
}

module.exports = [requestValidationHandler, handler]