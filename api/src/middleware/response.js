
module.exports = async function (req, res, next) {
  res.reqF = function (msg, code = -1000) {
    res.json({
      code,
      data: { message: msg, },
    })
  }
  res.reqS = function (data, code = 1000) {
    res.json({
      code,
      data,
    })
  }
  return next()
}
