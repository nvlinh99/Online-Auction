require('express-async-errors')
const _ = require('lodash')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const filehound = require('filehound')
const path = require('path')
const configuration = require('./configuration')
const model = require('./model')
const logger = require('./logger').getLogger('Server')

// eslint-disable-next-line no-underscore-dangle
global.__staticPath = path.join(__dirname, '..', 'static')

exports.start = async function () {
  // connect to db server
  await model.connect()

  // create express app - apply glocal middleware
  const app = express()
  app.use(require('helmet')())
  if (configuration.compression.enable) app.use(compression(configuration.compression.opts))
  if (configuration.cors.enable) app.use(cors(configuration.cors.opts))
  app.use(express.json(configuration.bodyParser.json))
  app.use(express.urlencoded(configuration.bodyParser.urlencoded))
  app.disable('x-powered-by')
  app.use(require('express-fileupload')())
  // eslint-disable-next-line no-undef
  app.use('/static', express.static(__staticPath))
  app.use(require('./middleware/response'))
  // load routes
  const routeDir = path.resolve(__dirname, './route')
  const routeFilePaths = await filehound.create()
    .path(routeDir)
    .ext('.js')
    .glob('index.js')
    .find()
  _.forEach(routeFilePaths, (routeFilePath) => {
    const route = require(routeFilePath)
    app.use(route.path, route.router)
  })

  // error handle
  app.use((req, res) => {
    res.status(404).json({
      message: 'Endpoint not found!',
    })
  })
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        message: 'Invalid input!',
      })
    }
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
