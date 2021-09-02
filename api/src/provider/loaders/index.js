const ConfigLoader = require('./config-loader')
const ExpressLoader = require('./express-loader')

const loaderList = [
  ConfigLoader,
  ExpressLoader,
]

module.exports = loaderList
