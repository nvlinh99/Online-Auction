const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const bidSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    productId: { type: Number, required: true },
    userId: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Number, required: true, default: 0 },
    bidTime: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
bidSchema.virtual("bidder", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
})
bidSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "id",
  justOne: true,
})
bidSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Bid", bidSchema)
