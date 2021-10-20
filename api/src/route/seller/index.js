const { Router, } = require('express')
const authHandler = require('../../middleware/auth')
const requireRoleHandler = require('../../middleware/require-role')
const  { USER_ROLE, } = require('../../constant/user')
const productHandler = require('./product')
const ratingHandler = require('./rating')

exports.path = '/sellers'

const sellerRouter = Router()

sellerRouter.use(authHandler.authorize, requireRoleHandler(USER_ROLE.SELLER))
sellerRouter
  .route('/product')
  .get(productHandler.getAllProduct)

sellerRouter
  .route('/winner')
  .get(productHandler.getProductSold)

sellerRouter
  .route('/winner/up/:bidderId')
  .put(ratingHandler.ratingUp)

sellerRouter
  .route('/winner/down/:bidderId')
  .put(ratingHandler.ratingDown)

sellerRouter
  .route('/winner/cancel/:bidderId')
  .put(ratingHandler.cancelTransaction)

exports.router = sellerRouter
