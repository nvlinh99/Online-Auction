import { BIDDER_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'

export default [
  {
    path: BIDDER_PATH,
    element: <DashboardLayout />,
    children: [],
  },
]
