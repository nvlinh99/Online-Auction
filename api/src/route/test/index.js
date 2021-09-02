const { Router, } = require('express')
const HelloController = require('./hello-world')

const TestRoute = Router()

TestRoute.get('/hello', HelloController.preHandler, HelloController.handler)

module.exports = TestRoute
