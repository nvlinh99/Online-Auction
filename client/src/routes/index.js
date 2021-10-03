import { USER_ROLE } from 'constants/userConstants'
import generalRoutes from './general.routes'
import getGuestRoutes from './guest.routes'
import bidderRoutes from './bidder.routes'
import sellerRoutes from './seller.routes'
import adminRoutes from './admin.routes'
const routesByRoles = {
  [USER_ROLE.BIDDER]: bidderRoutes,
  [USER_ROLE.SELLER]: sellerRoutes,
  [USER_ROLE.ADMIN]: adminRoutes,
}
export const getRoutes = ({ currentUser, location }) => {
  if (currentUser && routesByRoles[currentUser.role]) {
    return [...generalRoutes, ...routesByRoles[currentUser.role]]
  }

  return [...generalRoutes, ...getGuestRoutes({ currentUser, location })]
}
