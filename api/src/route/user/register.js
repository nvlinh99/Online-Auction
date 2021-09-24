const joi = require('joi')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const md5 = require('md5')
const moment = require('moment')
const SendEmailService = require('../../service/emailService')
const UserModel = require('../../model/user')
const UserConstant = require('../../constant/user')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')

const REGISTER_CONFIRM_PATH = '/users/register/confirmation'
const REGISTER_CONFIRM_EMAIL_SUBJECT = '[Online Auction] - Register account confirmation!'

const requestValidationHandler = genRequestValidation({
  body: joi.object({
    firstName: joi.string().trim().required().invalid('', null),
    lastName: joi.string().trim().required().invalid('', null),
    email: joi.string().trim().required().invalid('', null).email(),
    address: joi.string().trim().required().invalid('', null),
    password: joi.string().trim().required().invalid('', null),
    confirmPassword: joi.string().trim().required().invalid('', null),
  }).unknown(false),
})

const registerHandler = async (req, res) => {
  const data = req.body

  if (data.password !== data.confirmPassword) {
    return res.json({
      code: -1000,
      data: {
        message: 'Mật khẩu và xác nhận mật khẩu không giống nhau.',
      },
    })
  }

  const existsUser = await UserModel.findOne({ email: data.email, })
  if (existsUser && existsUser.status !== UserConstant.USER_STATUS.INACTIVE) {
    return res.json({
      code: -1000,
      data: {
        message: 'Email đã tồn tại!',
      },
    })
  }

  const hasedPassword = await new Promise((rsl, rjt) => {
    bcrypt.hash(data.password, configuration.bcryptSaltRounds, (err, hashed) => {
      if (err) return rjt(err)
      rsl(hashed)
    })
  })
  const verifyCode = await new Promise((rsl, rjt) => {
    crypto.randomBytes(configuration.verifyCodeBytesLength, (err, buf) => {
      if (err) return rjt(err)
      rsl(buf.toString('base64'))
    })
  })
  const hashedVerifyCode = md5(verifyCode)
  const verifyCodeExpireAt = moment().add(configuration.verifyCodeExpireTimeInMin, 'minutes').toDate()

  delete data.confirmPassword
  data.password = hasedPassword
  data.role =  UserConstant.USER_ROLE.BIDDER
  data.status = UserConstant.USER_STATUS.INACTIVE
  data.verifyCode = hashedVerifyCode
  data.verifyCodeExpireAt = verifyCodeExpireAt

  let userData = null
  if (existsUser) {
    userData = await UserModel.findOneAndUpdate(
      { email: data.email, },
      { 
        $set: data,
      },
      { new: true, }
    )
    if (!userData) {
      return res.json({
        code: -1000,
        data: {
          message: 'Đăng kí thất bại!',
        },
      })
    }
  } else {
    userData = await UserModel.create(data)
    if (!userData) {
      return res.json({
        code: -1000,
        data: {
          message: 'Đăng kí thất bại!!',
        },
      })
    }
  }

  res.json({
    code: 1000,
    data: {
      message: 'Đăng kí tài khoản thành công, vui lòng xác nhận tài khoản.',
      user: {
        id: userData.id,
      },
    },
  })
  
  const sendEmailService = new SendEmailService({ 
    name: `${userData.firstName} ${userData.lastName}`, 
    email: userData.email, 
  })
  
  const confirmationLink = `${configuration.server.host}${REGISTER_CONFIRM_PATH}?token=${encodeURIComponent(verifyCode)}`
  const content = getConfirmationEmailContent(confirmationLink)
  sendEmailService.send(content, REGISTER_CONFIRM_EMAIL_SUBJECT)
}

module.exports = [
  requestValidationHandler,
  registerHandler,
]

function getConfirmationEmailContent(link) {
  return `
    <p>Bạn vừa đăng kí tài khoản trên hệ thống Online Auction.</p>
    <p>Vui lòng click vào link bên dưới để xác nhận tài khoản (trong vòng ${configuration.verifyCodeExpireTimeInMin} phút). Nếu không phải là bạn, xin vui lòng bỏ qua email này.</p>
    <a href="${link}"><p>${link}</p></a>
  `
}
