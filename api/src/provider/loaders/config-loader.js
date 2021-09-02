const Configuration = require('../configuration')

function load() {
  Configuration.loadConfig()
}

module.exports = {
  load,
}
