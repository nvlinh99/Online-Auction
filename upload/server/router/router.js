const route = require('express').Router()
const controller = require('../controller/controller');
const store = require('../middleware/multer')

route.get('/',controller.home);
route.get('/:imageName',controller.getImage);
route.post('/', store.array('images', 12) , controller.uploads);

module.exports = route;
