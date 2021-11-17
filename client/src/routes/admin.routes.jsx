import { ADMIN_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import AdminCategoryPage from 'pages/AdminCategoryPage'
import AdminDashboardPage from 'pages/AdminDashboardPage'
import AdminProductListPage from 'pages/AdminProductListPage'
import AdminUpgradePage from 'pages/AdminUpgradePage'

export default [
  {
    path: ADMIN_PATH,
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboardPage />,
      },
      {
        path: 'category',
        element: <AdminCategoryPage />,
      },
      {
        path: 'products',
        element: <AdminProductListPage />,
      },
      {
        path: 'upgrade',
        element: <AdminUpgradePage />,
      },
    ],
  },
]
