const { Router } = require("express")
const loginController = require("./login")
const categoryRoutes = require("./category")
const deleteProductController = require("./delete-product")
const userController = require("./user")
const upgradeController = require("./upgrade")
const authHandler = require("../../middleware/auth")

exports.path = "/admin"

const adminRouter = Router()
adminRouter.post("/login", loginController)

// Auth route: Action require logged in admin
adminRouter.use(authHandler.authorize, authHandler.restrictToAdmin())
adminRouter.use(categoryRoutes.path, categoryRoutes.router)
adminRouter.use(upgradeController.path, upgradeController.router)

adminRouter.route("/products/:id").delete(deleteProductController)

adminRouter
  .route("/user")
  .get(userController.getAllUsers)
  .post(userController.validateUpdate, userController.createUser)

adminRouter
  .route("/user/:id")
  .get(userController.getUser)
  .put(userController.validateUpdate, userController.updateUser)
  .delete(userController.deleteUser)

exports.router = adminRouter
