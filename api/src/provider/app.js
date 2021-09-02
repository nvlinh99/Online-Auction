const Async = require('async')
const LoaderList = require('./loaders')

async function start() {
  await Async.each(LoaderList, async (loader) => {
    await loader.load()
  })
}

module.exports = {
  start,
}
