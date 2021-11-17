const joi = require("joi")
const genRequestValidation = require("../../../middleware/gen-request-validation")
const UpgradeModel = require("../../../model/upgrade")

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      page: joi.number().integer().positive().invalid(null),
      limit: joi.number().integer().positive().invalid(null),
    })
    .unknown(false),
})

const handler = async (req, res) => {
  const { page = 1, limit = 25 } = req.body
  const data = await UpgradeModel.paginate(
    {
      status: {
        $ne: 1,
      },
      expiredDate: {
        $gte: new Date(),
      },
    },
    {
      page,
      limit,
      populate: ["user"],
      sort: {
        createdAt: -1,
      },
    },
  )
  if (!data) {
    return res.reqF("Lấy danh sách yêu cầu nâng cấp thất bại")
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [requestValidationHandler, handler]
