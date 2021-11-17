const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const nanoid = require("../util/nanoid")

const upgradeSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: nanoid.getGenFunction() },
    userId: { type: Number, required: true },
    status: { type: Number, required: true },
    expiredDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)
upgradeSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
})

upgradeSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Upgrade", upgradeSchema)
