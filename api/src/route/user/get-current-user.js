const UserModel = require('../../model/user')
const genRequestValidation = require('../../middleware/gen-request-validation')
const USER_CONSTANTS = require('../../constant/user')

const requestValidationHandler = genRequestValidation({})

const updateHandler = async (req, res) => {
  const currentUser = await UserModel
    .findOne({ id: req.user.id, status:  USER_CONSTANTS.USER_STATUS.ACTIVE, })
    .populate("watchList")
    .select('-_id -password -status -verifyCode -verifyCodeExpireAt')
    .lean()
  if (!currentUser) {
    return res.json({
      code: -1000,
      data: {
        message: 'Tài khoản không tồn tại',
      },
    })
  }
  res.json({
    code: 1000,
    data: {
      message: 'Lấy thông tin tài khoản thành công',
      currentUser,
    },
  })
}

module.exports = [requestValidationHandler, updateHandler,]
