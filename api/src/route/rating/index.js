const { Router, } = require('express')
const rateController = require('./rate')

exports.path = '/rating'

const ratingRouter = Router()
ratingRouter.post('/', rateController)

exports.router = ratingRouter
