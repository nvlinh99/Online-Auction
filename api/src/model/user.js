const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const nanoid = require('../util/nanoid')

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true,default: nanoid.getGenFunction(), },
  firstName: { type: String, },
  lastName: { type: String, },
  address: { type: String, },
  dateOfBirth: { type: Date, default: null, },
  email: { type: String, unique: true, required: true, },
  password: { type: String, required: true, },
  role: { type: Number, required: true, },
  rateTotal: { type: Number, default: 0, },
  rateIncrease: { type: Number, default: 0, },
  rateDecrease: { type: Number, default: 0, },
  status: { type: Number, required: true, },
  avatarUrl: { type: String, },
  verifyCode: { type: String, },
  verifyCodeExpireAt: { type: Date, },
}, {
  timestamps: true,
})

userSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', userSchema)
