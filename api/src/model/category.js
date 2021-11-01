const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    title: { type: String, required: true },
    parentId: { type: Number, default: null },
    status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
categorySchema.virtual("parent", {
  ref: "Category",
  localField: "parentId",
  foreignField: "id",
  count: true,
})
categorySchema.virtual("childrens", {
  ref: "Category",
  localField: "id",
  foreignField: "parentId",
})
categorySchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Category", categorySchema)
