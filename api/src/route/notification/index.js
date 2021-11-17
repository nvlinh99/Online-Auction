const { Router, } = require('express')
const getManyController = require('./get-many')
const readController = require('./read')

exports.path = '/notifications'

const notiRouter = Router()
notiRouter.get('/', getManyController)
notiRouter.put('/read', readController)

exports.router = notiRouter
