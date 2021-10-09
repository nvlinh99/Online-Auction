const bcrypt = require('bcrypt')

const saltRounds  = 10

exports.createHashedPassword = async (password) => {
  return bcrypt.hash(password, saltRounds)
}

exports.verifyHashedPassword = async (rawPassword, hashedPassword) => {
  return bcrypt.compare(rawPassword, hashedPassword)
}
