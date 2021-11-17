const { Router, } = require('express')
const toggleWatchlistController = require('./toggle')
const getListController = require('./get-list')
const authHandler = require('../../middleware/auth')

exports.path = '/watchlist'

const watchlistRouter = Router()

watchlistRouter.use(authHandler.authorize, authHandler.restrictToUser())

watchlistRouter.post('/toggle', toggleWatchlistController)
watchlistRouter.get('/get-list', getListController)

exports.router = watchlistRouter
