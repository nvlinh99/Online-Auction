const { Router, } = require('express')
const loginController = require('./login')
const categoryController = require('./category')
const productController = require('./product')
const userController = require('./user')
const upgradeController = require('./upgrade')
const authHandler = require('../../middleware/auth')

exports.path = '/admin'

const adminRouter = Router()
adminRouter.post('/login', loginController)

// Auth route: Action require logged in admin
adminRouter.use(authHandler.authorize, authHandler.restrictToAdmin())
adminRouter
  .route('/category')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory)

adminRouter
  .route('/category/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

adminRouter
  .route('/product/:id')
  .delete(productController.deleteProduct)

adminRouter
  .route('/user')
  .get(userController.getAllUsers)
  .post(userController.createUser)

adminRouter
  .route('/user/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

adminRouter
  .route('/upgrade')
  .get(upgradeController.getAllUpgrades)

adminRouter
  .route('/upgrade/:id')
  .put(upgradeController.upgrade)

adminRouter
  .route('/downgrade/:id')
  .put(upgradeController.downgrade)

exports.router = adminRouter
