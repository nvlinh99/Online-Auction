import {
  ADMIN_PATH,
  BIDDER_PATH,
  LOGIN_PATH,
  SELLER_PATH,
} from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import { Navigate } from 'react-router-dom'

const getGuestRoutes = ({ location }) => {
  const loginPath = `${LOGIN_PATH}?retRef=${
    location.pathname + location.search
  }`
  return [
    {
      path: '/guest',
      element: <DashboardLayout />,
      children: [],
    },

    //role
    {
      path: ADMIN_PATH,
      element: <Navigate to={loginPath} />,
      children: [
        {
          path: '*',
          element: <Navigate to={loginPath} />,
        },
      ],
    },
    {
      path: BIDDER_PATH,
      element: <Navigate to={loginPath} />,
      children: [
        {
          path: '*',
          element: <Navigate to={loginPath} />,
        },
      ],
    },
    {
      path: SELLER_PATH,
      element: <Navigate to={loginPath} />,
      children: [
        {
          path: '*',
          element: <Navigate to={loginPath} />,
        },
      ],
    },
  ]
}
export default getGuestRoutes
