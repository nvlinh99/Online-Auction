const { Router } = require("express")
const getListController = require("./get-list")
const addController = require("./add")
const updateController = require("./update")
const deleteController = require("./delete")

exports.path = "/categories"

const router = Router()

router.post("/get-list", getListController)
router.post("/add", addController)
router.put("/update/:id", updateController)
router.delete("/delete/:id", deleteController)

exports.router = router
