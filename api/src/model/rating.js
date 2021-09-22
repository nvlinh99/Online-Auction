const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  userId: { type: Number, required: true, },
  rateById: { type: Number, required: true, },
  comment: { type: String, },
})

module.exports = mongoose.model('Rating', ratingSchema)
