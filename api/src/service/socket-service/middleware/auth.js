const path = require('path')
const jwt = require('jsonwebtoken')
const { promisify, } = require('util')

exports.authorize = async function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.accessToken) {
    const token = socket.handshake.query.accessToken
    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      socket.user = decoded
    } catch (err) {
      return next(new Error('Authentication error'))
    }
    return next()
  } 
  next(new Error('Authentication error'))
}

exports.authorizeOptional = async function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.accessToken) {
    const token = socket.handshake.query.accessToken
    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      socket.user = decoded
    } catch (err) {
      return next()
    }
  } 
  return next()
}

// exports.authorize = () => {
//    // Get token
//    let token
//    if (
//      req.headers.authorization
//      && req.headers.authorization.startsWith('Bearer ')
//    ) {
//      token = req.headers.authorization.split(' ')[1]
//    } else {
//      return res.status(401).json({
//        code: -1000,
//        message: 'Bạn không đăng nhập! Vui lòng đăng nhập để có quyền truy cập!',
//      })
//    }
 
//    try {
//      // Verify token
//      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
//      req.user = decoded
//    } catch (err) {
//      return res.status(401).json({
//        code: -1000,
//        message: 'Token không hợp lệ hoặc đẵ hết hạn! Vui lòng thử đăng nhập lại.',
//      })
//    }
//    return next()
// }
