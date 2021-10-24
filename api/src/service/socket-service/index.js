const _ = require('lodash')
const authMdw = require('./middleware/auth')

let io = null
const eventSocketMapping = {}
const emitter = {
  emit(event, data) {
    const socketList = eventSocketMapping[event]
    if (!socketList || !socketList.length) return
    socketList.forEach((socket) => {
      socket.emit(event, data)
    })
  },
}

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
    const productId = _.get(socket, 'user.id', null)
    if (!productId) return
    const eventName = `product-change-${productId}`
    if (!eventSocketMapping[eventName]) {
      eventSocketMapping[eventName] = []
    }
    eventSocketMapping[eventName].push(socket)
    socket.on('disconnect', () => {
      const i = eventSocketMapping[eventName].indexOf(socket)
      if (i >= 0) {
        eventSocketMapping[eventName].splice(i, 1)
      }
    })
  })

  const newNotiNsp = io.of('/new-noti')
  newNotiNsp.use(authMdw.authorize)
  newNotiNsp.on('connection', (socket) => {
    const userId = _.get(socket, 'handshake.query.productId', null)
    if (!userId) return
    const eventName = `new-noti-${userId}`
    if (!eventSocketMapping[eventName]) {
      eventSocketMapping[eventName] = []
    }
    eventSocketMapping[eventName].push(socket)
    socket.on('disconnect', () => {
      const i = eventSocketMapping[eventName].indexOf(socket)
      if (i >= 0) {
        eventSocketMapping[eventName].splice(i, 1)
      }
    })
  })
  return io
}
