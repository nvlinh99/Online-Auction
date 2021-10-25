const { Router } = require("express")
const rateController = require("./rate")
const getUserRatingController = require("./get-user-rating")
const authHandler = require("../../middleware/auth")

exports.path = "/rating"

const ratingRouter = Router()
ratingRouter.use(authHandler.authorize, authHandler.restrictToUser())

ratingRouter.post("/", rateController)
ratingRouter.post("/get-user-rating", getUserRatingController)

exports.router = ratingRouter
