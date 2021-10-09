const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const TestSchema = new mongoose.Schema({
  id: { type: Number, unique: true, default: nanoid.getGenFunction(), },
  username: { type: String, unique: true, },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Test', TestSchema)
