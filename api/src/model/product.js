const mongoose = require('mongoose')
const nanoid = require('../util/nanoid')

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true,default: nanoid.getGenFunction(), },
  name: { type: String, required: true, },
  description: { type: String, },
  categoryId: { type: Number, required: true, },
  avatarUrl: { type: String, },
  imageUrls: [String, ],
  status: { type: Number, required: true, default: 0, },
  startPrice: { type: Number, required: true, },
  currentPrice: { type: Number, default: null, },
  stepPrice: { type: Number, required: true, },
  purchasePrice: { type: Number, required: true, },
  publishedDate: { type: Date, default: Date.now(), },
  totalBid: { type: Number, default: 0, },
  sellerId: { type: Number, required: true, },
  winnerId: { type: Number, default: null, },
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

productSchema.index({ name: 'text', }, { weights: { name: 5, }, })

module.exports = mongoose.model('Product', productSchema)
// commit
