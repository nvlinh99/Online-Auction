import { ADMIN_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import AdminCategoryPage from 'pages/AdminCategoryPage'

export default [
  {
    path: ADMIN_PATH,
    element: <DashboardLayout />,
    children: [
      {
        path: 'category',
        element: <AdminCategoryPage />,
      },
    ],
  },
]
