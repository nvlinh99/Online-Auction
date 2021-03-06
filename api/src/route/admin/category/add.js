const joi = require("joi")
const genRequestValidation = require("../../../middleware/gen-request-validation")
const CategoryModel = require("../../../model/category")

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      title: joi.string().required().invalid(null, ""),
      parentId: joi.number().integer().positive().allow(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { title, parentId = null } = req.body
  const body = { title, parentId }
  const existed = await CategoryModel.findOne({
    title,
    status: {
      $ne: 1,
    },
  })
  if (existed) {
    return res.reqF("Tên danh mục đã tồn tại")
  }
  if (parentId) {
    const invalidParent = await CategoryModel.findOne({
      id: parentId,
      status: {
        $ne: 1,
      },
    })
    if (!invalidParent) {
      return res.reqF("Danh mục cha Không tồn tại")
    }
  }
  const data = await CategoryModel.create(body)
  if (!data) {
    return res.reqF("Tạo Danh mục thất bại")
  }

  return res.reqS({
    category: data,
    message: "Tạo Danh mục thành công",
  })
}

module.exports = [requestValidationHandler, handler]
