import { SELLER_PATH } from 'constants/routeConstants'
import DashboardLayout from 'Layouts/DashboardLayout'
import MainLayout from 'Layouts/MainLayout'
import SellerBiddingListPage from 'pages/SellerBiddingListPage'
import SellerWonProductsPage from 'pages/SellerWonProductsPage'

export default [
  {
    path: SELLER_PATH,
    element: <MainLayout />,
    children: [
      {
        path: 'bidding-products',
        element: <SellerBiddingListPage />,
      },
      {
        path: 'won-products',
        element: <SellerWonProductsPage />,
      },
    ],
  },
]
