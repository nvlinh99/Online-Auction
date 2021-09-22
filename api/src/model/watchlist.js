const mongoose = require('mongoose')

const watchListSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  userId: { type: Number, required: true, },
  productId: { type: Number, required: true, },
})

module.exports = mongoose.model('WatchList', watchListSchema)
