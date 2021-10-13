const { Router, } = require('express')
const bidController = require('./bid')
const authHandler = require('../../middleware/auth')
const requireRoleHandler = require('../../middleware/require-role')
const  { USER_ROLE, } = require("../../constant/user")

exports.path = '/bids'

const bidRouter = Router()

bidRouter.use(authHandler.authorize,requireRoleHandler(USER_ROLE.BIDDER))
bidRouter.post('/', bidController)

exports.router = bidRouter
