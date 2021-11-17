const joi = require('joi')
const crypto = require('crypto')
const md5 = require('md5')
const moment = require('moment')
const SendEmailService = require('../../service/emailService')
const genRequestValidation = require('../../middleware/gen-request-validation')
const User = require('../../model/user')
const UserConstant = require('../../constant/user')
const configuration = require('../../configuration')
const passwordValidator = require('../../util/passwordValidator')

const getPagination = (page, limit) => {
  const size = limit ? +limit : 10
  const offset = page ? page * limit : 0
  return { size, offset, }
}

exports.getAllUsers = async (req, res) => {
  const { page, limit, } = req.query
  const { size, offset, } = getPagination(page, limit)
  await User.paginate({}, { offset, size, })
    .then((data) => {
      res.status(200).json({
        code: 1000,
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      })
    })
    .catch(() => {
      res.status(500).send({
        code: -1000,
        message: 'Đã xảy ra một số lỗi khi truy xuất',
      })
    })
}

exports.getUser = async (req, res) => {
  const { id, } = req.params

  const user = await User.findOne({ id, }).select('-password')

  if (!user) {
    return res.status(404).json({
      code: -1000,
      message: 'Không tìm thấy người dùng này!',
    })
  }

  return res.status(200).json({
    code: 1000,
    data: user,
  })
}
exports.validateCreate = genRequestValidation({
  body: joi.object({
    firstName: joi.string().trim().required().invalid('', null),
    lastName: joi.string().trim().required().invalid('', null),
    email: joi.string().trim().required().invalid('', null).email(),
    address: joi.string().trim().required().invalid('', null),
    password: joi.string().trim().required().invalid('', null),
  }).unknown(false),
})

exports.createUser = async (req, res) => {
  const data = req.body
  const existsUser = await User.findOne({ email: data.email, })
  if (existsUser && existsUser.status !== UserConstant.USER_STATUS.INACTIVE) {
    return res.json({
      code: -1000,
      data: {
        message: 'Email đã tồn tại!',
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
  const hashedPassword = await passwordValidator.createHashedPassword(data.password)

  delete data.confirmPassword
  data.password = hashedPassword
  data.role =  UserConstant.USER_ROLE.BIDDER
  data.status = UserConstant.USER_STATUS.INACTIVE
  data.verifyCode = hashedVerifyCode
  data.verifyCodeExpireAt = verifyCodeExpireAt

  let userData = null
  if (existsUser) {
    userData = await User.findOneAndUpdate(
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
    userData = await User.create(data)
    if (!userData) {
      return res.json({
        code: -1000,
        data: {
          message: 'Đăng kí thất bại!!',
        },
      })
    }
  }

  const sendEmailService = new SendEmailService({ 
    name: `${userData.firstName} ${userData.lastName}`, 
    email: userData.email, 
  })
  await sendEmailService.sendConfirmMail(verifyCode)

  res.json({
    code: 1000,
    data: {
      message: 'Đăng kí tài khoản thành công, vui lòng xác nhận tài khoản.',
      user: {
        id: userData.id,
      },
    },
  })
}

exports.validateUpdate = genRequestValidation({
  body: joi.object({
    firstName: joi.string().trim().required().invalid('', null),
    lastName: joi.string().trim().required().invalid('', null),
    email: joi.string().trim().required().invalid('', null).email(),
    address: joi.string().trim().required().invalid('', null),
    dateOfBirth: joi.date().required().invalid('', null),
    password: joi.string().trim().required().invalid('', null),
  })
    .unknown(false), })

exports.updateUser = async (req, res) => {
  const { id, } = req.params
  const data = req.body

  const isUpdate = await User.findOneAndUpdate({ id, }, {
    $set: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      password: await passwordValidator.createHashedPassword(data.password),
    },
  }, { returnOriginal: false, })

  if (!isUpdate) {
    res.json({
      code: -1000,
      data: {
        message: 'Cập nhật thông tin thất bại.',
      },
    })
  }

  res.json({
    code: 1000,
    data: {
      message: 'Cập nhật thông tin thành công.',
    },
  })
}

exports.deleteUser = async (req, res) => {
  const { id, } = req.params

  const user = await User.deleteOne({ id, })
  if (!user) {
    res.json({
      code: -1000,
      message: 'Xoá người dùng thất bại!',
    })
  }
  res.json({
    code: 1000,
    message: 'Xoá người dùng thành công!',
  })
}
