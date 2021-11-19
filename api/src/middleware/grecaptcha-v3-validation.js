const grecaptchaV3Service = require('../service/grecaptcha-v3-service')

module.exports = async function (req, res, next) {
  const grecaptchaToken = req.headers['x-grecaptcha-token']
  console.log("🚀 ~ file: grecaptcha-v3-validation.js ~ line 5 ~ grecaptchaToken", grecaptchaToken)
  if (!grecaptchaToken) return res.status(403).json({ message: 'Forbidden' })
  
  const [ succeeded ] = await grecaptchaV3Service.verifyToken(grecaptchaToken)
  if (!succeeded) return res.status(403).json({ message: 'Forbidden' })
  
  return next()
}