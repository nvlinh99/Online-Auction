const { Router } = require("express")
const rateController = require("./rate")
const getUserRatingController = require("./get-user-rating")

exports.path = "/rating"

const ratingRouter = Router()
ratingRouter.post("/", rateController)
ratingRouter.post("/get-user-rating", getUserRatingController)

exports.router = ratingRouter
