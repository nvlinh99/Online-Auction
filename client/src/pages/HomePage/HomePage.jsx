import React, { useEffect } from 'react'
import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { categorySelector } from 'store/category'
import { getCategoriesFromAPI } from 'store/category/action'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => {
  return {
    container: {
      background: theme.palette.success.main,
    },
  }
})
const HomePage = () => {
  const classes = useStyles()
  const allCategories = useSelector(categorySelector.selectCategories)
  useEffect(() => {
    getCategoriesFromAPI()
  }, [])
  return (
    <div className={classes.container}>
      <h1 className='bg-[#ff1111] text-lg'>
        <Typography variant='h1'>Hello home 123</Typography>
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
