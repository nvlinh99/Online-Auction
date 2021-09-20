import MainLayout from 'Layouts/MainLayout'
import HomePage from 'pages/HomePage/HomePage'
import ProductDetailPage from 'pages/ProductDetailPage'
import ProductListPage from 'pages/ProductListPage'
export default [
  {
    path: '/',
    element: <MainLayout />,

    children: [
      {
        path: '',
        element: <HomePage />,
        outlet: 'HomePage',
      },
      {
        path: 'products',

        children: [
          {
            path: '',
            outlet: 'Product',
            element: <ProductListPage />,
          },
          {
            path: ':productId',
            outlet: 'ProductDetail',
            element: <ProductDetailPage />,
          },
        ],
      },
    ],
  },
]
