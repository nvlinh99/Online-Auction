const joi = require("joi")
const ProductService = require("../../service/product-service")
const genRequestValidation = require("../../middleware/gen-request-validation")
const UserModel = require("../../model/user")
const ProductModel = require("../../model/product")
const WatchlistModel = require("../../model/watchlist")
const BidModel = require("../../model/bid")

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
      filterType: joi.string().trim(),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25, filterType } = req.body
  const { id: userId } = req.user
  const queryObj = {
    biderIdList: userId,
    bannedUser: { $ne: userId },
    status: {
      $ne: 1,
    },
  }
  if (filterType === "not-end") {
    queryObj.expiredDate = {
      $gte: new Date(),
    }
    queryObj.winnerId = null
  }
  if (filterType === "has-won") {
    queryObj.winnerId = {
      $ne: null,
    }
  }
  const data = await ProductModel.paginate(queryObj, {
    page,
    limit,
    populate: [
      "totalBids",
      "categoryInfo",
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
    sort: {
      expiredDate: -1,
      currentPrice: -1,
    },
  })
  if (!data) {
    return res.reqF("Lấy danh sách  sản phẩm thất bại")
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [requestValidationHandler, handler]
