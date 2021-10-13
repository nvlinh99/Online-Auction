const joi = require('joi')
const _ = require('lodash')
const moment = require('moment')
const md5 = require('md5')
const ProductModel = require('../../model/product')
const ProductService = require('../../service/product-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const authMdw = require('../../middleware/auth')
const policyMdw = require('../../middleware/require-role')
const { USER_ROLE, } = require('../../constant/user')

// name: { type: String, required: true, },
//   description: { type: String, },
//   categoryId: { type: Number, required: true, },
//   avatarUrl: { type: String, },
//   imageUrls: [String, ],
//   status: { type: Number, required: true, },
//   startPrice: { type: Number, required: true, },
//   currentPrice: { type: Number, default: null, },
//   stepPrice: { type: Number, required: true, },
//   purchasePrice: { type: Number, required: true, },
//   publishedDate: { type: Date, default: Date.now(), },
//   totalBid: { type: Number, default: 0, },
//   sellerId: mongoose.Schema.Types.ObjectId,
//   winnerId: mongoose.Schema.Types.ObjectId,
//   expiredDate: {
//     type: Date,
//     default: () => {
//       const expDate = new Date()
//       return expDate.setDate(expDate.getDate() + 7)
//     },
//   },
//   autoRenew: Boolean,
//   bannedUser: [Number, ],

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      name: joi.string().trim().required().invalid('', null),
      categoryId: joi.number().integer().positive().invalid(null),
      description: joi.string().trim().required().invalid('', null),
      avatarUrl: joi.string().trim().required().invalid('', null),
      imageUrls: joi.array().required().min(3).items(joi.string().trim().required().invalid('', null)),
      startPrice: joi.number().integer().required().positive().invalid(0, null),
      stepPrice: joi.number().integer().required().positive().invalid(0, null),
      purchasePrice: joi.number().integer().positive().invalid(0, null),
      expiredDate: joi.date().greater('now').required().invalid(null, ''),
      autoRenew: joi.bool().invalid(null).default(false),
    })
    .unknown(false),
})
// const a = { 
//   name:'Laptop Lenovo',
//   categoryId:3178787916,
//   description:'<p>Laptop Lenovo cũ</p>',
//   startPrice:1000000,
//   stepPrice:200000,
//   purchasePrice:2000000,
//   expiredDate:'2021-10-18T17:01:22.277Z',
//   avatarUrl:'http://res.cloudinary.com/dvj5jkexx/image/upload/v1633971688/cugfwblwskdjeycmhzsd.jpg',
//   imageUrls:['http://res.cloudinary.com/dvj5jkexx/image/upload/v1633971683/ilqdx8w8vein12zx9uxl.png','http://res.cloudinary.com/dvj5jkexx/image/upload/v1633971684/szwkwdktpnnxjyl1oyfb.jpg','http://res.cloudinary.com/dvj5jkexx/image/upload/v1633971685/ibj3h0ls5x9hqsg4rod4.jpg',], 
// }
const postProductHandler = async (req, res) => {
  const data = _.cloneDeep(req.body)
  
  if (data.purchasePrice && data.purchasePrice < data.startPrice + data.stepPrice) {
    return res.json({
      code: -1000,
      data: {
        message: 'Giá mua ngay phải lớn hơn hoặc bằng tổng giá khởi điểm và bước giá.',
      },
    })
  }

  const nowMoment = moment()
  const expiredDateMoment = moment(data.expiredDate)
  if (expiredDateMoment.isSameOrBefore(nowMoment)) {
    return res.json({
      code: -1000,
      data: {
        message: 'Ngày hết hạn không hợp lệ.',
      },
    })
  }
  data.currentPrice = data.startPrice
  data.expiredDate = expiredDateMoment.toDate()
  data.sellerId = req.user.id

  const createdProd = await ProductModel.create(data)
  if (!createdProd) {
    return res.json({
      code: -1000,
      data: {
        message: 'Đăng bán sản phẩm thất bại.',
      },
    })
  }

  return res.json({
    code: 1000,
    data: {
      product: createdProd,
    },
  })
}

module.exports = [
  authMdw.authorize,
  policyMdw(USER_ROLE.SELLER),
  requestValidationHandler,
  postProductHandler,
]
