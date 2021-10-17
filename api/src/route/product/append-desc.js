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
const socketEmitter = require('../../service/socket-service').emitter

const requestValidationHandler = genRequestValidation({
  params: joi
    .object({
      productId: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
  body: joi
    .object({
      appended: joi.string().trim().required().invalid('', null),
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
const handler = async (req, res) => {
  const { params: { productId, }, body: { appended, }, user, } = req
  
  const product = await ProductModel.findOne({ id: productId, sellerId: user.id, })
  if (!product) return res.reqF('Sản phẩm không tồn tại.')

  const description = `${product.description}<br/>✏️ ${moment().format('hh:mm DD/MM/YYYY')}<br/>${appended}<br/>`
  const updated = await ProductModel.findOneAndUpdate({
    id: productId,
  }, {
    $set: { description, },
  }, { 
    new: true,
  })
  if (!updated) return res.reqF('Thêm mô tả sản phẩm thất bại.')
  
  res.reqS({
    description: updated.description,
  })

  socketEmitter.emit(`product-change-${productId}`, {
    product: {
      description: updated.description,
    },
  })
}

module.exports = [
  authMdw.authorize,
  policyMdw(USER_ROLE.SELLER),
  requestValidationHandler,
  handler,
]
