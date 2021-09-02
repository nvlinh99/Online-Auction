const _ = require('lodash')
const Dotenv = require('dotenv')
const Path = require('path')

const config = {
  env: 'development',
  server: {
    port: 3000,
  },
  cors: {
    enable: false,
    opts: undefined,
  },
  compression: {
    enable: false,
    opts: undefined,
  },
}

function toBool(string) {
  return string === 'true'
}

function loadConfig(path) {
  path = path || Path.join(__dirname, '../../.env')
  Dotenv.config({ path, })

  const loadedConfig = {
    env: process.env.NODE_ENV,
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

  _.merge(config, loadedConfig)
  return config
}

function getConfig() {
  return config
}

module.exports = {
  loadConfig,
  getConfig,
}
