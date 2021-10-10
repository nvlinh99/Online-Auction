const joi = require('joi')
const ProductService = require('../../service/product-service')
const genRequestValidation = require('../../middleware/gen-request-validation')
const UserModel = require('../../model/user')
const ProductModel = require('../../model/product')
const WatchlistModel = require('../../model/watchlist')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      productId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const toggleWatchlistHandler = async (req, res) => {
  const { productId, } = req.body
  const { id:userId, } = req.user
 const product = await  ProductModel.findOne({ id:productId, })
  if (!product) {
    return res.json({
      code: -1000,
      data:{
        message:"Sản phẩm không tồn tại",
      },
    })
  }
  const watchItem = await  WatchlistModel.findOne({ productId,userId, })
  if (watchItem) {
    await WatchlistModel.deleteOne({ _id:watchItem._id, })
    return res.json({
      code:1000,
      data:{
        
        message:"Xoá sản phẩm ra khỏi danh sách xem thành công",
      },
    })
  } 

  const added = await WatchlistModel.create({ productId,userId, })
  return res.json({
    code:1000,
    data:{
      added,
      message:"Thêm sản phẩm vào danh sách xem thành công",
    },
  })
}

  


module.exports = [
  requestValidationHandler,
  toggleWatchlistHandler,
]
