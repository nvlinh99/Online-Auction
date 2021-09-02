require('express-async-errors')
const Express = require('express')
const CORS = require('cors')
const Compression = require('compression')
const Configuration = require('../configuration')
const Logger = require('../logger')

const TestRoute = require('../../route/test')

function loadRoute(app) {
  app.use('/test', TestRoute)
}

async function load() {
  const config = Configuration.getConfig()
  const logger = Logger.getLogger('Server')

  const app = Express()
  if (config.compression.enable) app.use(Compression(config.compression.opts))
  if (config.cors.enable) app.use(CORS(config.cors.opts))
  app.use(Express.json(config.bodyParser.json))
  app.use(Express.urlencoded(config.bodyParser.urlencoded))
  app.disable('x-powered-by')

  // load routes
  loadRoute(app)

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
    app.listen(config.server.port, () => {
      logger.info(`Server is running @ PORT: ${config.server.port}`)
      res()
    })
  })
}

module.exports = {
  load,
}
