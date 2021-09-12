const _ = require('lodash')
const filehound = require('filehound')
const Sequelize = require('sequelize').Sequelize
const configuration = require('../configuration')

const postgresqlConfig = configuration.postgresql
const sequelize = new Sequelize(
  postgresqlConfig.db,
  postgresqlConfig.user,
  postgresqlConfig.password,
  postgresqlConfig.config
)
exports.sequelize = sequelize
exports.Sequelize = Sequelize

const modelFilePaths = filehound.create()
  .path(__dirname)
  .ext('.js')
  .not()
  .glob('index.js')
  .findSync()
_.forEach(modelFilePaths, (modelFilePath) => {
  const model = require(modelFilePath)(sequelize)
  exports[model.name] = model
})
exports.connect = function () {
  return sequelize.sync()
}
