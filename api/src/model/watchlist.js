const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const watchListSchema = new mongoose.Schema({
  id: { type: Number, required: true,  default: nanoid.getGenFunction(), },
  userId: { type: Number, required: true, },
  productId: { type: Number, required: true, },
}, {
  timestamps: true,
})

module.exports = mongoose.model('WatchList', watchListSchema)
