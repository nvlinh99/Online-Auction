const { Router, } = require('express')
const loginController = require('./login')
const categoryController = require('./category')
const authHandler = require('../../middleware/auth')

exports.path = '/admin'

const userRouter = Router()
userRouter.post('/login', loginController)

// Auth route: Action require logged in user
userRouter.use(authHandler.authorize, authHandler.restrictToAdmin())
userRouter.get('/category', categoryController.getAllCategories)

exports.router = userRouter
