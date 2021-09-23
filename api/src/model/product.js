const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true,default: nanoid.getGenFunction(), },
  name: { type: String, required: true, },
  description: { type: String, },
  categoryId: { type: Number, required: true, },
  avatarUrl: { type: String, },
  imageUrls: [String, ],
  status: { type: Number, required: true, },
  startPrice: { type: Number, required: true, },
  stepPrice: { type: Number, required: true, },
  purchasePrice: { type: Number, required: true, },
  publishedDate: { type: Date, default: Date.now(), },
  sellerId: mongoose.Schema.Types.ObjectId,
  winnerId: mongoose.Schema.Types.ObjectId,
  expiredDate: {
    type: Date,
    default: () => {
      const expDate = new Date()
      return expDate.setDate(expDate.getDate() + 7)
    },
  },
  autoRenew: Boolean,
  bannedUser: [Number, ],
}, {
  timestamps: true,
})

module.exports = mongoose.model('Product', productSchema)
