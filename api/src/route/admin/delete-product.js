const genRequestValidation = require("../../middleware/gen-request-validation")
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
  const data = await ProductModel.findOneAndUpdate(
    { id },
    { $set: { status: 1 } },
    { new: true },
  )
  return res.reqS({
    message: "Xóa sản phẩm thành công",
    product: data,
  })
}

module.exports = [requestValidationHandler, handler]
