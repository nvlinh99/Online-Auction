const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const bidSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: nanoid.getGenFunction(), },
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  price: { type: Number, required: true, },
  status: { type: Number, required: true, },
  bidTime: { type: Date, default: Date.now(), },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Bid', bidSchema)
