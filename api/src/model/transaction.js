const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const nanoid = require('../util/nanoid')

const ratingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    winnerId: { type: Number, required: true },
    sellerId: { type: Number, required: true },
    productId: { type: Number, required: true },
    status: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
ratingSchema.virtual('winner', {
  ref: 'User',
  localField: 'winnerId',
  foreignField: 'id',
  justOne: true,
})
ratingSchema.virtual('seller', {
  ref: 'User',
  localField: 'sellerId',
  foreignField: 'id',
  justOne: true,
})
ratingSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: 'id',
  justOne: true,
})
ratingSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Transaction', ratingSchema)
