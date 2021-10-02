import React, { useCallback, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { categorySelector } from 'store/category'
import { getCategoriesFromAPI } from 'store/category/action'
import { makeStyles } from '@mui/styles'
import StarBorder from '@mui/icons-material/StarBorder'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ProductList from './ProductList'

import './home-page.css'

const useStyles = makeStyles((theme) => {
  return {
    container: {
      background: theme.palette.success.main,
    },
  }
})

const DropDown = ({ category }) => {
  const [open, setOpen] = useState(false)
  const collExpand = useCallback(() => {
    setOpen(true)
  }, [setOpen])
  const collClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const childs = category.childs || []
  return (
    <div onMouseOver={collExpand} onMouseLeave={collClose}>
      <Link to={`/products?categoryId=${category.id}`}>
        <ListItemButton
          style={
            open
              ? {
                  background: 'rgba(0, 0, 0, 0.1)',
                }
              : {}
          }
          sx={{ pl: 4 }}
        >
          <ListItemText primary={<strong>{category.title}</strong>} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Link>
      {childs.length && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {childs.map((item) => (
              <Link key={item.id} to={`/products?categoryId=${item.id}`}>
                <ListItemButton sx={{ pl: 6 }}>
                  <ListItemText
                    primary={
                      <span style={{ fontSize: '14px' }}>{item.title}</span>
                    }
                  />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      )}
    </div>
  )
}

const HomePage = () => {
  const classes = useStyles()
  const allCategories = useSelector(categorySelector.selectCategories)

  useEffect(() => {
    getCategoriesFromAPI()
  }, [])
  return (
    <div style={{ flex: '1', display: 'flex' }}>
      <div style={{ width: '15%', minWidth: '180px', background: '#E7E9EB' }}>
        <Typography
          variant='h6'
          style={{
            padding: '1.5rem 0',
            paddingRight: '1rem',
            lineHeight: '1rem',
            fontWeight: 'bold',
            paddingLeft: '2rem',
          }}
        >
          Danh mục sản phẩm
        </Typography>
        {allCategories.map((item) => (
          <DropDown key={item.id} category={item} />
        ))}
      </div>
      <div style={{ flex: '1' }}>
        <ProductList />
      </div>
    </div>
  )
}

export default HomePage
