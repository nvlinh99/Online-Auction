require('express-async-errors')
const _ = require('lodash')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const filehound = require('filehound')
const path = require('path')
const configuration = require('./configuration')
const logger = require('./logger').getLogger('Server')

module.exports.start = async function () {
  // create express app - apply glocal middleware
  const app = express()
  if (configuration.compression.enable) app.use(compression(configuration.compression.opts))
  if (configuration.cors.enable) app.use(cors(configuration.cors.opts))
  app.use(express.json(configuration.bodyParser.json))
  app.use(express.urlencoded(configuration.bodyParser.urlencoded))
  app.disable('x-powered-by')

  // load routes
  const routeDir = path.resolve(__dirname, './route')
  const routeFilePaths = await filehound.create()
    .path(routeDir)
    .ext('.js')
    .glob('index.js')
    .find()
  _.forEach(routeFilePaths, (roteFilePath) => {
    const route = require(roteFilePath)
    app.use(route.path, route.router)
  })

  // error handle
  app.use((req, res) => {
    res.status(404).json({
      message: 'Endpoint not found!',
    })
  })
  app.use((err, req, res) => {
    logger.error(err.stack || err.message)
    res.status(500).json({
      message: 'Unknow error!',
    })
  })

  // start server
  await new Promise((res) => {
    app.listen(configuration.server.port, () => {
      logger.info(`Server is running @ PORT: ${configuration.server.port}`)
      res()
    })
  })
}
