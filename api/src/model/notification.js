const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const nanoid = require('../util/nanoid')

const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: nanoid.getGenFunction(), },
  userId: { type: Number, required: true, },
  type: { type: Number, required: true },
  title: { type: String, required: true, },
  read: { type: Boolean, required: true, default: false },
  description: { type: String, default: null, },
  data: { type: mongoose.Schema.Types.Mixed }
},{
  timestamps: true,
})

notificationSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Notification', notificationSchema)
