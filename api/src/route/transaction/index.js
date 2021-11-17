const { Router } = require('express')
const getController = require('./get-tran')
const updateController = require('./update')

exports.path = '/transactions'

const tranRouter = Router()

tranRouter.get('/', getController)
tranRouter.put('/:tranId', updateController)
exports.router = tranRouter
