const { Router } = require("express")
const getListController = require("./get-list")
const approveController = require("./approve")
const rejectController = require("./reject")

exports.path = "/upgrade"

const router = Router()

router.post("/get-list", getListController)
router.put("/approve/:id", approveController)
router.put("/reject/:id", rejectController)

exports.router = router
