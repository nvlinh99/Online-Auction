const configuration = require('../configuration')
const consoleLogger = require('./console-logger')
const fileLogger = require('./file-logger')

exports.getLogger = function (scope) {
  return consoleLogger.getLogger(scope)
  // if (configuration.env === 'development') {
  //   return consoleLogger.getLogger(scope)
  // }

  // return fileLogger.getLogger(scope)
}
