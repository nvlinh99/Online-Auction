const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const watchListSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    userId: { type: Number, required: true },
    productId: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
watchListSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "id",
  justOne: true,
})
watchListSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("WatchList", watchListSchema)
