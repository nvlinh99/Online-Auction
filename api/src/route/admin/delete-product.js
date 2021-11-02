const joi = require("joi")
const genRequestValidation = require("../../middleware/gen-request-validation")
const CategoryModel = require("../../model/category")
const ProductModel = require("../../model/product")

const requestValidationHandler = genRequestValidation({})

const handler = async (req, res) => {
  const { id } = req.params
  const existedId = await ProductModel.findOne({
    id,
    status: {
      $ne: 1,
    },
  })
  if (!existedId) {
    return res.reqF("Sản phẩm không tồn tại")
  }
  const data = await ProductModel.findByIdAndUpdate(
    { id },
    { $set: { status: 1 } },
    { new: true },
  )
  return res.reqS({
    message: "Xóa Danh mục thành công",
    product: data,
  })
}

module.exports = [requestValidationHandler, handler]
