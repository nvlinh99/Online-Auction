const grecaptchaV3Service = require('../service/grecaptcha-v3-service')

module.exports = async function (req, res, next) {
  const grecaptchaToken = req.headers['x-grecaptcha-token']
  if (!grecaptchaToken) return res.status(403).json({ message: 'Forbidden' })
  
  const [ succeeded ] = await grecaptchaV3Service.verifyToken(grecaptchaToken)
  if (!succeeded) return res.status(403).json({ message: 'Forbidden' })
  
  return next()
}