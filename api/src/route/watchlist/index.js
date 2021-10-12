const { Router, } = require('express')
const toggleWatchlistController = require('./toggle')
const authHandler = require('../../middleware/auth')

exports.path = '/watchlist'

const watchlistRouter = Router()

watchlistRouter.use(authHandler.authorize, authHandler.restrictToUser())

watchlistRouter.post('/toggle', toggleWatchlistController)

exports.router = watchlistRouter
