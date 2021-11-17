const { Router } = require("express")
const upgradeToSellerController = require("./upgrade-to-seller")
const getBiddingProductsController = require("./get-bidding-products")
const getWonProductsController = require("./get-won-products")
const authHandler = require("../../middleware/auth")
const requireRoleHandler = require("../../middleware/require-role")
const { USER_ROLE } = require("../../constant/user")

exports.path = "/bidders"

const bidRouter = Router()

bidRouter.use(authHandler.authorize, requireRoleHandler(USER_ROLE.BIDDER))
bidRouter.post("/upgrade-to-seller", upgradeToSellerController)
bidRouter.post("/get-bidding-products", getBiddingProductsController)
bidRouter.post("/get-won-products", getWonProductsController)

exports.router = bidRouter
