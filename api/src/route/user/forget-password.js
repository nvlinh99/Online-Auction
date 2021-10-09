const joi = require('joi')
const md5 = require('md5')
const crypto = require('crypto')
const moment = require('moment')
const UserModel = require('../../model/user')
const UserConstant = require('../../constant/user')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')
const SendEmailService = require('../../service/emailService')

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      email: joi.string().email().required().invalid('', null),
    })
    .unknown(false),
})

const forgetPasswordHandler = async (req, res) => {
  const { email, } = req.body
  const user = await UserModel.findOne({
    email,
    status: UserConstant.USER_STATUS.ACTIVE,
  })
  if (!user) {
    return res.json({
      code: -1000,
      data: {
        message: 'Tài khoản không tồn tại',
      },
    })
  }
  const verifyCode = await new Promise((rsl, rjt) => {
    crypto.randomBytes(configuration.verifyCodeBytesLength, (err, buf) => {
      if (err) return rjt(err)
      rsl(buf.toString('base64'))
    })
  })
  const hashedVerifyCode = md5(verifyCode)
  const verifyCodeExpireAt = moment().add(configuration.verifyCodeExpireTimeInMin, 'minutes').toDate()
  const updatedUser = await UserModel.findOneAndUpdate(
    { id: user.id, },
    {
      $set: { verifyCode: hashedVerifyCode, verifyCodeExpireAt, },
    },
    { new: true, }
  )
  if (!updatedUser) {
    return res.json({
      code: -1000,
      data: {
        message: 'Gửi yêu cầu thất bại!',
      },
    })
  }
  res.json({
    code: 1000,
    data: {
      message: 'Gửi yêu cầu thành công',
    },
  })
  
  const sendEmailService = new SendEmailService({
    name: `${updatedUser.firstName} ${updatedUser.lastName}`,
    email: updatedUser.email,
  })

  await sendEmailService.sendResetPassword(verifyCode)
}
module.exports = [requestValidationHandler, forgetPasswordHandler,]
