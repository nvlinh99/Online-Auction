const dotenv = require('dotenv')
const path = require('path')
const deepFreeze = require('deepfreeze')

function toBool(string) {
  return string === 'true'
}

const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath, })

module.exports = deepFreeze({
  env: process.env.NODE_ENV || 'development',
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    opts: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  cors: {
    enable: toBool(process.env.ENABLE_CORS) || false,
    opts: undefined,
  },
  compression: {
    enable: toBool(process.env.ENABLE_COMPRESSION) || false,
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
})
