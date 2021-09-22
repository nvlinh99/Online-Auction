const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  title: { type: String, required: true, },
  parent: { type: String, required: true, },
})

module.exports = mongoose.model('Category', categorySchema)
