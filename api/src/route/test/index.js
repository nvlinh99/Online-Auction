const { Router, } = require('express')
const helloController = require('./hello-world')

module.exports.path = '/test'

const testRouter = Router()
testRouter.get('/hello', helloController)
module.exports.router = testRouter
