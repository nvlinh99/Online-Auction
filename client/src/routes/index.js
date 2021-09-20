import generalRoutes from './general.routes'
import guestRoutes from './guest.routes'

export const getRoutes = (options) => {
  return [...generalRoutes, ...guestRoutes]
}
