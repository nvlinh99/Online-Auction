const _ = require('lodash')
const events = require('events')
const authMdw = require('./middleware/auth')

let io = null
const emitter = new events.EventEmitter()

exports.emitter = emitter
exports.init = function (server) {
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST',],
    },
  })
  const productChangeNsp = io.of('/product-change')
  productChangeNsp.use(authMdw.authorizeOptional)
  productChangeNsp.on('connection', (socket) => {
    const productId = _.get(socket, 'handshake.query.productId', null)
    if (!productId) return
    const eventName = `product-change-${productId}`
    emitter.on(eventName, (data) => {
      socket.emit(eventName, data)
    })
  })

  return io
}
