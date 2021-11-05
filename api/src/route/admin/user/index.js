const { Router } = require('express')
const getListController = require('./get-list')
const addController = require('./add')
const updateController = require('./update')
const blockController = require('./block')
const { USER_ROLE } = require('../../../constant/user')

exports.path = '/admin/users'

const router = Router()
router.use(require('../../../middleware/auth').authorize)
router.use(require('../../../middleware/require-role')(USER_ROLE.ADMIN))

router.post('/get-list', getListController)
router.post('/add', addController)
router.put('/update/:id', updateController)
router.put('/block/:id', blockController)

exports.router = router
