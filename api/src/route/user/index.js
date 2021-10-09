const { Router, } = require('express')
const loginController = require('./login')
const registerController = require('./register')
const registerConfirmationHandler = require('./register-confirmation')
const forgetPasswordHandler = require('./forget-password')
const resetPasswordHandler = require('./reset-password')
const updatePasswordHandler = require('./update-password')
const updateHandler = require('./update-info')
const authHandler = require('../../middleware/auth')
const getCurrentUserHandler = require('./get-current-user')

exports.path = '/users'

const userRouter = Router()
userRouter.post('/login', loginController)
userRouter.post('/register', registerController)
userRouter.get('/register/confirmation', registerConfirmationHandler)
userRouter.post('/forget-password', forgetPasswordHandler)
userRouter.post('/reset-password', resetPasswordHandler)

// Auth route: Action require logged in user
userRouter.use(authHandler.authorize, authHandler.restrictToUser())
userRouter.post('/update-info', updateHandler)
userRouter.post('/update-password', updatePasswordHandler)
userRouter.post('/get-current-user', getCurrentUserHandler)

exports.router = userRouter
