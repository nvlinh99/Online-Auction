const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  firstName: { type: String, },
  lastName: { type: String, },
  address: { type: String, },
  dateOfBirth: { type: Date, default: '01/01/1990', },
  email: { type: String, unique: true, required: true, },
  password: { type: String, required: true, },
  role: { type: Number, required: true, },
  rateTotal: { type: Number, default: 0, },
  rateIncrease: { type: Number, default: 0, },
  rateDecrease: { type: Number, default: 0, },
  status: { type: Number, required: true, },
  avatarUrl: { type: String, },
  verifyCode: { type: String, },
})

module.exports = mongoose.model('User', userSchema)
