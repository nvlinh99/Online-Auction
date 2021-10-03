const { Router, } = require('express')
const loginController = require('./login')
const categoryController = require('./category')
const authHandler = require('../../middleware/auth')

exports.path = '/admin'

const adminRouter = Router()
adminRouter.post('/login', loginController)

// Auth route: Action require logged in user
adminRouter.use(authHandler.authorize, authHandler.restrictToAdmin())
adminRouter
  .route('/category')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory)
adminRouter.get('/category/:id', categoryController.getCategory)

exports.router = adminRouter
