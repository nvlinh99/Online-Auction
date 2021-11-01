const joi = require("joi")
const genRequestValidation = require("../../../middleware/gen-request-validation")
const CategoryModel = require("../../../model/category")
const ProductModel = require("../../../model/product")

const requestValidationHandler = genRequestValidation({})

const handler = async (req, res) => {
  const { id } = req.params
  const existedId = await CategoryModel.findOne({
    id,
    status: {
      $ne: 1,
    },
  }).populate("childrens")
  if (!existedId) {
    return res.reqF("Danh mục không tồn tại")
  }
  const data = await CategoryModel.findOneAndDelete({ id }, { new: true })
  ProductModel.updateMany({ categoryId: id }, { status: 1 })
  return res.reqS({
    message: "Xóa Danh mục thành công",
    category: data,
  })
}

module.exports = [requestValidationHandler, handler]
