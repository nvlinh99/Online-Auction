const path = require('path')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const UserModel = require('../../model/user')
const UserConstant = require('../../constant/user')
const genRequestValidation = require('../../middleware/gen-request-validation')
const passwordValidator = require('../../util/passwordValidator')

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath, })

const requestValidationHandler = genRequestValidation({
  body: joi.object({
    email: joi.string().trim().required().invalid('', null).email(),
    password: joi.string().trim().required().invalid('', null),
  }).unknown(false),
})

const signToken = (type, id) => {
  return jwt.sign({ type, id, }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const loginHandler = async (req, res) => {
  const data = req.body
  const user = await UserModel.findOne({ email: data.email, })
  // Check if customer is blocked or inactive
  if (user) {
    switch (user.status) {
      case UserConstant.USER_STATUS.INACTIVE:
        return res.json({
          code: 400,
          data: {
            message: 'Tài khoản của bạn chưa kích hoạt!',
          },
        })
      case UserConstant.USER_STATUS.BLOCKED:
        return res.json({
          code: 400,
          data: {
            message: 'Tài khoản của bạn đã bị khoá!',
          },
        })
      default:
    }
  }
  
  if (
    !user || !(await passwordValidator.verifyHashedPassword(data.password, user.password))
  ) {
    return res.json({
      code: 400,
      data: {
        message: 'Email/Mật khẩu không đúng!',
      },
    })
  }

  // Create login token and send to client
  const token = signToken('user', user.id)

  res.json({
    code: 200,
    data: {
      message: 'Đăng nhập thành công.',
      token,
    },
  })
}

module.exports = [
  requestValidationHandler,
  loginHandler,
]
