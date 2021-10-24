import { USER_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import MainLayout from 'Layouts/MainLayout'
import BiddingListPage from 'pages/BiddingListPage'
import WatcghListPage from 'pages/WatcghListPage'
import WonProductsPage from 'pages/WonProductsPage'

export default [
  {
    path: USER_PATH,
    element: <MainLayout />,
    children: [
      {
        path: 'watchlist',
        element: <WatcghListPage />,
      },
      {
        path: 'bidding-products',
        element: <BiddingListPage />,
      },
      {
        path: 'won-products',
        element: <WonProductsPage />,
      },
    ],
  },
]
