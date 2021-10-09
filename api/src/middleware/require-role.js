const _ = require('lodash')

module.exports = function (role) {
  const roles = _.isArray(role) ? role : [role,]

  return function (req, res, next) {
    if (_.includes(roles, (_.get(req, 'user.role', null)))) {
      return next()
    }

    return res.status(403).json({
      message: 'Forbidden',
    })
  }
}
