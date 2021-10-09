const { Router, } = require('express')
const helloController = require('./hello-world')

exports.path = '/test'

const testRouter = Router()
testRouter.get('/hello', helloController)
testRouter.get('/confirm', (req, res) => {
  res.json({
    status: req.query.status,
  })
})
exports.router = testRouter
