const Product = require('../../model/product')

exports.deleteProduct = async (req, res) => {
  const { id, } = req.params

  const product = await Product.deleteOne({ id, })
  if (!product) {
    res.json({
      code: -1000,
      message: 'Xoá sản phẩm thất bại!',
    })
  }
  res.json({
    code: 1000,
    message: 'Xoá sản phẩm thành công!',
  })
}
