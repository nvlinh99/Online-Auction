const { Router, } = require('express')
const getTopProductsController = require('./get-top')
const getProductsWithFilterController = require('./get-with-filter')
const postProductController = require('./post-product')
const getOneProductController = require('./get-one')
const appendDescController = require('./append-desc')

exports.path = '/products'

const productRouter = Router()
productRouter.post('/', postProductController)
productRouter.get('/:productId', getOneProductController)
productRouter.put('/:productId/append-description', appendDescController)
productRouter.post('/get-with-filter', getProductsWithFilterController)
productRouter.get('/top', getTopProductsController)

exports.router = productRouter
