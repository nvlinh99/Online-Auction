import { ADMIN_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import AdminCategoryPage from 'pages/AdminCategoryPage'
import AdminProductListPage from 'pages/AdminProductListPage'

export default [
  {
    path: ADMIN_PATH,
    element: <DashboardLayout />,
    children: [
      {
        path: 'category',
        element: <AdminCategoryPage />,
      },
      {
        path: 'products',
        element: <AdminProductListPage />,
      },
    ],
  },
]
