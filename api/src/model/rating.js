const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const ratingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    userId: { type: Number, required: true },
    rateById: { type: Number, required: true },
    type: { type: Number, required: true },
    comment: { type: String }, // dislike ,like
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
ratingSchema.virtual("rateBy", {
  ref: "User",
  localField: "rateById",
  foreignField: "id",
  justOne: true,
})
ratingSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Rating", ratingSchema)
