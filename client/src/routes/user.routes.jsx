import { USER_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import MainLayout from 'Layouts/MainLayout'
import WatcghListPage from 'pages/WatcghListPage'

export default [
  {
    path: USER_PATH,
    element: <MainLayout />,
    children: [
      {
        path: 'watchlist',
        element: <WatcghListPage />,
      },
    ],
  },
]
