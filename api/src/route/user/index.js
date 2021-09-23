const { Router, } = require('express')
const registerController = require('./register')
const registerConfirmationHandler = require('./register-confirmation')

exports.path = '/users'

const userRouter = Router()
userRouter.post('/register', registerController)
userRouter.get('/register/confirmation', registerConfirmationHandler)
exports.router = userRouter
