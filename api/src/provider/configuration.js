const Dotenv = require('dotenv')
const Path = require('path')

let config = null

function toBool(string) {
  return string === 'true'
}

function loadConfig(path) {
  if (config) return config

  path = path || Path.join(__dirname, '../../.env')
  Dotenv.config({ path, })

  config = {
    server: {
      port: parseInt(process.env.PORT, 10),
    },
    cors: {
      enable: toBool(process.env.ENABLE_CORS === 'true'),
      opts: undefined,
    },
    compression: {
      enable: toBool(process.env.ENABLE_COMPRESSION),
      opts: undefined,
    },
    bodyParser: {
      json: {
        limit: parseInt(process.env.MAX_UPLOAD_LIMIT, 10) || 50000,
      },
      urlencoded: {
        limit: parseInt(process.env.MAX_UPLOAD_LIMIT, 10) || 50000,
        parameterLimit: parseInt(process.env.MAX_PARAMETER_LIMIT, 10) || 50000,
        extended: false,
      },
    },
  }

  return config
}

function getConfig() {
  return loadConfig()
}

module.exports = {
  loadConfig,
  getConfig,
}
