const joi = require("joi")
const ProductService = require("../../service/product-service")
const genRequestValidation = require("../../middleware/gen-request-validation")
const UserModel = require("../../model/user")
const ProductModel = require("../../model/product")
const RatingModel = require("../../model/rating")
const { RATING_TYPE } = require("../../constant/rating")

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
      type: joi.number().integer().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25, type } = req.body
  const { id: userId } = req.user
  const queryObj = { userId }
  if (Object.values(RATING_TYPE).includes(type)) {
    queryObj.type = type
  }

  const data = await RatingModel.paginate(queryObj, {
    page,
    limit,
    populate: "rateBy",
  })
  if (!data) {
    return res.reqF({
      message: "Lấy danh sách  đánh giá thất bại",
    })
  }
  const totalLike = await RatingModel.countDocuments({
    userId,
    type: RATING_TYPE.LIKE,
  })
  const totalDisLike = await RatingModel.countDocuments({
    userId,
    type: RATING_TYPE.DISLIKE,
  })
  return res.reqS({
    totalLike,
    totalDisLike,
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [requestValidationHandler, handler]
