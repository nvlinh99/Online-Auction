import { USER_ROLE } from 'constants/userConstants'
import generalRoutes from './general.routes'
import bidderRoutes from './bidder.routes'
import sellerRoutes from './seller.routes'
import adminRoutes from './admin.routes'
import userRoutes from './user.routes'

export const getRoutes = ({ currentUser, location }) => {
  return [
    ...generalRoutes,
    ...bidderRoutes,
    ...sellerRoutes,
    ...adminRoutes,
    ...userRoutes,
  ]
}
