const path = require('path')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const UserModel = require('../../model/user')
const genRequestValidation = require('../../middleware/gen-request-validation')
const passwordValidator = require('../../util/passwordValidator')

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath, })

const validateLogin = genRequestValidation({
  body: joi.object({
    email: joi.string().trim().required().invalid('', null).email(),
    password: joi.string().trim().required().invalid('', null),
  }).unknown(false),
})

const signToken = (type, role, id) => {
  return jwt.sign({ type, id, role, }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const loginHandler = async (req, res) => {
  const data = req.body
  const admin = await UserModel.findOne({ email: data.email, })

  // Check if email and password exist
  if (!data.email || !data.password) {
    return res.status(400).json({
      code: -1000,
      message: 'Vui lòng cung cấp email/mật khẩu!',
    })
  }
  
  if (
    !admin || !(await passwordValidator.verifyHashedPassword(data.password, admin.password))
  ) {
    return res.status(400).json({
      code: -1000,
      data: {
        message: 'Email/Mật khẩu không đúng!',
      },
    })
  }

  if (admin && admin.role !== 0) {
    return res.status(403).json({
      code: -1000,
      data: {
        message: 'Forbidden! Bạn không có quyền truy cập.',
      },
    })
  }

  // Create login token and send to client
  const token = signToken('admin', admin.role, admin.id)

  res.status(200).json({
    code: 1000,
    data: {
      message: 'Đăng nhập thành công.',
      token,
    },
  })
}

module.exports = [
  validateLogin,
  loginHandler,
]
