const { Router, } = require('express')
const helloController = require('./hello-world')

exports.path = '/test'

const testRouter = Router()
testRouter.get('/hello', helloController)
exports.router = testRouter
