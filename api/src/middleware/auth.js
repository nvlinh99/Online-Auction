const path = require('path')
const jwt = require('jsonwebtoken')
const { promisify, } = require('util')

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath, })

exports.authorize = async (req, res, next) => {
  // Get token
  let token
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else {
    return res.status(401).json({
      code: -1000,
      message: 'Bạn không đăng nhập! Vui lòng đăng nhập để có quyền truy cập!',
    })
  }

  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch (err) {
    return res.status(401).json({
      code: -1000,
      message: 'Token không hợp lệ hoặc đẵ hết hạn! Vui lòng thử đăng nhập lại.',
    })
  }
  return next()
}

exports.authorizeOptional = async (req, res, next) => {
  // Get token
  let token
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      req.user = decoded
    // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  return next()
}

exports.restrictToAdmin = () => {
  return (req, res, next) => {
    if (req.user && req.user.role !== 0) {
      return res.status(403).json({
        code: -1000,
        message: 'Forbidden! Bạn không có quyền truy cập.',
      })
    }
    next()
  }
}

exports.restrictToUser = () => {
  return (req, res, next) => {
    if (req.user && req.user.role === 0) {
      return res.status(403).json({
        code: -1000,
        message: 'Forbidden! Bạn không có quyền truy cập vào trang User',
      })
    }
    next()
  }
}
