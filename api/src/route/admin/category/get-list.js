const joi = require("joi")
const genRequestValidation = require("../../../middleware/gen-request-validation")
const CategoryModel = require("../../../model/category")

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25 } = req.body
  const { id: userId } = req.user
  const data = await CategoryModel.paginate(
    {
      userId,
      status: {
        $ne: 1,
      },
      parentId: null,
    },
    {
      page,
      limit,
      populate: ["childrens"],
      sort: {
        createdAt: -1,
      },
    },
  )
  if (!data) {
    return res.reqF("Lấy danh sách Danh mục thất bại")
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [requestValidationHandler, handler]
