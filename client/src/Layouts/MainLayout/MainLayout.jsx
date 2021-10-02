import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
const MainLayout = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column' }}
      className='h-full'
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout
