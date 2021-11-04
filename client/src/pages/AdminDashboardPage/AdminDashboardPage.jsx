import { Card } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { adminSidebarListItems } from 'Layouts/DashboardLayout/Sidebar'
import React from 'react'
const AdminDashboardPage = () => {
  return (
    <div className='mt-10'>
      <div className='panel py-4'>
        <div className='panel-title'>Trang tổng quan</div>
      </div>
      <div className=' py-4'>
        {' '}
        <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-[35px] '>
          {adminSidebarListItems.slice(1).map((item) => {
            return (
              <Card
                key={item.url}
                className='group hover:cursor-pointer shadow-product rounded-[8px] duration-300 ease-linear transform-gpu'
              >
                <Meta
                  style={{ title: 'text-white' }}
                  avatar={
                    <item.Icon
                      size={24}
                      className='group-hover:text-[#942dd9]'
                    />
                  }
                  title={
                    <span className='group-hover:text-[#942dd9]'>
                      {item.label}
                    </span>
                  }
                  description={item.subLabel}
                />
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
