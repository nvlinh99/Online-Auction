const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  price: { type: Number, required: true, },
  status: { type: Number, required: true, },
  bidTime: { type: Date, default: Date.now(), },
})

module.exports = mongoose.model('Bid', bidSchema)
