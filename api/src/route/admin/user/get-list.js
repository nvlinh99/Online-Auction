const joi = require('joi')
const _ = require('lodash')
const { USER_ROLE } = require('../../../constant/user')
const genRequestValidation = require('../../../middleware/gen-request-validation')
const CategoryModel = require('../../../model/category')
const UserModel = require('../../../model/user')

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
  
  const data = await UserModel.paginate(
    {
      role: { $ne: USER_ROLE.ADMIN }
    },
    {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
    },
  )
  if (!data) {
    return res.reqF('Lấy danh sách tài khoản thất bại')
  }

  return res.reqS({
    totalItems: data.totalDocs,
    items: _.map(data.docs, (u) => _.pick(u, ['id', 'firstName', 'lastName', 'address', 'email', 'password', 'role', 'status', 'createdAt'])),
    totalPages: data.totalPages,
    currentPage: data.page,
  })
}

module.exports = [requestValidationHandler, handler]
