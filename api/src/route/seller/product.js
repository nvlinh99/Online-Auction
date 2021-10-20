const ProductModel = require('../../model/product')

exports.getAllProduct = async (req, res) => {
  const { user, } = req
  const dateNow = (new Date()).toISOString()

  await ProductModel.find({ sellerId: user.id, status: 0, expiredDate: { $gte: dateNow, }, }, (err, product) => {
    if (err) {
      res.json({
        code: -1000,
        message: 'Bạn không có sản phẩm nào đang bán còn hạn!',
      })
    } else {
      res.json({
        code: 1000,
        data: product,
      })
    }
  })
}

exports.getProductSold = async (req, res) => {
  const { user, } = req

  const listWinner = await ProductModel.find({ sellerId: user.id, status: 1, winnerId:  { $ne: null, }, })
  if (!listWinner) {
    res.json({
      code: -1000,
      message: 'Không tìm thấy danh sách sản phẩm có người chiến thắng!',
    })
  }
  res.json({
    code: 1000,
    data: listWinner,
  })
}
