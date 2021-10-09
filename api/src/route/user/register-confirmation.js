const joi = require('joi')
const md5 = require('md5')
const UserModel = require('../../model/user')
const UserConstant = require('../../constant/user')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi.object({
    token: joi.string().required().invalid('', null),
  }).unknown(false),
})

const registerConfirmationHandler = async (req, res) => {
  const { token, } = req.query
  
  const succeededRedirectUrl = `${configuration.confirmEmailRedirectUrl}?status=SUCCEEDED`
  const failedRedirectUrl = `${configuration.confirmEmailRedirectUrl}?status=FAILED`
  
  const hashedToken = md5(token)
  const userData = await UserModel.findOne({
    verifyCode: hashedToken,
    verifyCodeExpireAt: { $gte: new Date(), },
    status: UserConstant.USER_STATUS.INACTIVE,
  })
  if (!userData) {
    return res.redirect(failedRedirectUrl)
  }

  const updateResponse = await UserModel.updateOne(
    { 
      id: userData.id,
      verifyCode: hashedToken,
      status: UserConstant.USER_STATUS.INACTIVE,
    },
    {
      $set: { 
        verifyCode: null,
        status: UserConstant.USER_STATUS.ACTIVE,
      },
    }
  )
  
  if (!updateResponse || updateResponse.nModified < 1) {
    return res.redirect(failedRedirectUrl)
  }

  return res.redirect(succeededRedirectUrl)
}

module.exports = [
  requestValidationHandler,
  registerConfirmationHandler,
]

