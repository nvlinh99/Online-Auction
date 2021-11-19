const axios = require('axios').default
const configuration = require('../configuration')

function getUrl(token) {
  return `https://www.google.com/recaptcha/api/siteverify?secret=${configuration.grecaptchaV3Secret}&response=${token}`;
}

exports.verifyToken = async function(token) {
  const url = getUrl(token)
  try {
    const response = await axios.post(url)
    console.log("🚀 ~ file: grecaptcha-v3-service.js ~ line 12 ~ exports.verifyToken=function ~ response", response)
    if (
      response.status !== 200 || 
      !response.data.success || 
      response.data.score < 0.5
    ) 
      return [false, response.data || null]

    return [true, response.data]
  } catch(err) {
    return [false, null]
  }
}