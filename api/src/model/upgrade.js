const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const upgradeSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: nanoid.getGenFunction(), },
  userId: { type: Number, required: true, },
  status: { type: Number, required: true, },
  expiredDate: { type: Date, required: true, },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Upgrade', upgradeSchema)
