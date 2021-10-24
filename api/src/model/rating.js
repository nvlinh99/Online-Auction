const mongoose = require("mongoose")
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
  },
)

module.exports = mongoose.model("Rating", ratingSchema)
