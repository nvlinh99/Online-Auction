const { Router, } = require('express')
const getTopProductsController = require('./get-top')
const getProductsWithFilterController = require('./get-with-filter')
const postProductController = require('./post-product')

exports.path = '/products'

const productRouter = Router()
productRouter.post('/', postProductController)
productRouter.post('/get-with-filter', getProductsWithFilterController)
productRouter.get('/top', getTopProductsController)

exports.router = productRouter
