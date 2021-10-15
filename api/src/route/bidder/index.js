const { Router, } = require('express')
const upgradeToSellerController = require('./upgrade-to-seller')
const authHandler = require('../../middleware/auth')
const requireRoleHandler = require('../../middleware/require-role')
const  { USER_ROLE, } = require('../../constant/user')

exports.path = '/bidders'

const bidRouter = Router()

bidRouter.use(authHandler.authorize,requireRoleHandler(USER_ROLE.BIDDER))
bidRouter.post('/upgrade-to-seller', upgradeToSellerController)

exports.router = bidRouter
