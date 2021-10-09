const _ = require('lodash')
const filehound = require('filehound')
const mongoose = require('mongoose')
const configuration = require('../configuration')

const mongodbConfig = configuration.mongodb

const modelFilePaths = filehound.create()
  .path(__dirname)
  .ext('.js')
  .not()
  .glob('index.js')
  .findSync()
_.forEach(modelFilePaths, (modelFilePath) => {
  const model = require(modelFilePath)
  exports[model.modelName] = model
})

exports.connect = function () {
  return mongoose.connect(mongodbConfig.uri, mongodbConfig.opts)
}
