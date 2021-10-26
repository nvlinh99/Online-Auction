import { ADMIN_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'

export default [
  {
    path: ADMIN_PATH,
    element: <DashboardLayout />,
    children: [
      {
        path: 'category',
      },
    ],
  },
]
