import io from 'socket.io-client'
import { userToken } from '../constants/GlobalConstants'

export const subProductChange = ({accessToken, productId, cb}) => {
  const socket = io(process.env.API_URL + '/product-change', {
    transports: ['websocket', 'polling'],
    query: {
      accessToken: userToken(),
      productId
    }
  })
  socket.on(`product-change-${productId}`, (data) => {
    cb(data)
  })

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect()
    }
  }
  return {
    disconnect
  }
}