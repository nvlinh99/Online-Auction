const mongoose = require('mongoose')

const upgradeSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  userId: { type: Number, required: true, },
  status: { type: Number, required: true, },
  expiredDate: { type: Date, required: true, },
})

module.exports = mongoose.model('Upgrade', upgradeSchema)
