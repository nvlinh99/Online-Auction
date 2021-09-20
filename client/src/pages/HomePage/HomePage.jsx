import React, { useEffect } from 'react'
import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { categorySelector } from 'store/category'
import { getCategoriesFromAPI } from 'store/category/action'

const HomePage = () => {
  const allCategories = useSelector(categorySelector.selectCategories)
  useEffect(() => {
    getCategoriesFromAPI()
  }, [])
  return (
    <div>
      <h1 className='bg-[#ff1111] text-lg'>
        <Typography variant='h1'>Hello home</Typography>
      </h1>
      <ul>
        {allCategories?.map((cat) => {
          return <li key={cat.id}>{cat.title}</li>
        })}
      </ul>
    </div>
  )
}

export default HomePage
