import MainLayout from 'Layouts/MainLayout'
import HomePage from 'pages/HomePage/HomePage'
import ProductDetailPage from 'pages/ProductDetailPage'
import ProductListPage from 'pages/ProductListPage'
import ForgetPassPage from 'pages/ForgetPassPage'
import RegisterPage from 'pages/RegisterPage'
import RegisterConfirmationPage from 'pages/RegisterPage/RegisterConfirmationPage'
import LoginPage from 'pages/LoginPage'
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
  {
    path: '/forget-password',
    element: <ForgetPassPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/register-confirmation',
    element: <RegisterConfirmationPage />,
  },
	{
    path: '/login',
    element: <LoginPage />,
  },
]
