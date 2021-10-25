const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    title: { type: String, required: true },
    parentId: { type: Number, default: null },
  },
  {
    timestamps: true,
  },
)

categorySchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Category", categorySchema)
