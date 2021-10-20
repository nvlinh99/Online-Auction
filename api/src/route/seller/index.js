const { Router, } = require('express')
const authHandler = require('../../middleware/auth')
const requireRoleHandler = require('../../middleware/require-role')
const  { USER_ROLE, } = require('../../constant/user')
const productHandler = require('./product')

exports.path = '/sellers'

const sellerRouter = Router()

sellerRouter.use(authHandler.authorize, requireRoleHandler(USER_ROLE.SELLER))
sellerRouter
  .route('/product')
  .get(productHandler.getAllProduct)

sellerRouter
  .route('/winner')
  .get(productHandler.getProductSold)

exports.router = sellerRouter
