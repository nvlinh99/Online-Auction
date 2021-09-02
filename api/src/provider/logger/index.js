const Configuration = require('../configuration')
const ConsoleLogger = require('./console-logger')
const FileLogger = require('./file-logger')

function getLogger(scope) {
  const config = Configuration.getConfig()

  if (config.env === 'development') {
    return ConsoleLogger.getLogger(scope)
  }

  return FileLogger.getLogger(scope)
}

module.exports = {
  getLogger,
}
