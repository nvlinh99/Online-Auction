const EmailService = require('./emailService')

// Change info to test
const user = { name: 'LinhNguyen', email: 'contact@linhnv.com', }

const verifyCode = 888888

// Send otp code to user
const emailService = new EmailService(user)

emailService.sendOTPCode(verifyCode)
