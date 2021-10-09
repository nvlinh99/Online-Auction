import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import IconLogin from '@mui/icons-material/Login'
import { Container, Select, MenuItem, cardHeaderClasses } from '@mui/material'
import { useSelector } from 'react-redux'
import IconSearch from '@mui/icons-material/SearchSharp'
import {
  selectCurrentUser,
  selectCurrentUserLoading,
} from 'store/user/selector'
import HeaderUserInfo from './HeaderUserInfo'
import { categorySelector } from 'store/category'
import { getCategoriesFromAPI } from 'store/category/action'
import './header.css'

const Logo = () => {
  return (
    <Link
      id='logo'
      to='/'
      style={{
        flex: 1.5,
        display: 'block',
        padding: '0.8rem 0',
        fontWeight: 'bold',
        fontSize: '1.5rem',
      }}
    >
      Online Auction
    </Link>
  )
}
const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isCurrentUserLoading = useSelector(selectCurrentUserLoading)
  const [searchInputData, setSearchInputData] = useState({
    categoryId: '-1',
    text: '',
  })
  const allCategories = useSelector(categorySelector.selectCategories)

  const selectedCateIdOnChange = useCallback((e) => {
    setSearchInputData((searchInputData) => ({
      ...searchInputData,
      categoryId: +e?.target?.value,
    }))
  }, [])
  const onChangeSearchText = useCallback((e) => {
    setSearchInputData((searchInputData) => ({
      ...searchInputData,
      text: e?.target?.value,
    }))
  }, [])
  const onClickSearch = useCallback(
    (e) => {
      const searchParams = new URLSearchParams(location.search)
      if (searchInputData.text) {
        searchParams.set('text', searchInputData.text)
      } else {
        searchParams.delete('text')
      }
      console.log(searchInputData.categoryId !== '-1')
      if (searchInputData.categoryId !== '-1') {
        searchParams.set('categoryId', searchInputData.categoryId)
      } else {
        searchParams.delete('categoryId')
      }
      console.log(searchParams.toString(), searchInputData.text)
      navigate({
        pathname: '/products',
        search: searchParams.toString(),
      })
    },
    [location.search, searchInputData]
  )
  const renderSelectedCate = useCallback(
    (selectedCateId) => {
      const df = <em>Danh mục</em>
      if (selectedCateId !== '-1') {
        for (let pCate of allCategories) {
          if (pCate?.id === selectedCateId) return pCate.title || df
          if (pCate?.childs) {
            for (let chCate of pCate.childs)
              if (chCate?.id === selectedCateId) return chCate.title || df
          }
        }
      }
      return df
    },
    [allCategories]
  )

  useEffect(() => {
    getCategoriesFromAPI()
  }, [])
  return (
    <header
      style={{
        color: 'white',
        background: '#2695ff',
      }}
    >
      <Container>
        <div className='flex justify-between items-center'>
          <Logo />
          <div className='search-cnt flex items-center'>
            {/* <select className='category-select' placeholder='Danh mục'>
              <option disabled selected key={-1} value={-1}>
                Danh mục
              </option>
              {allCategories?.map((cate) => (
                <>
                  <option key={cate.id} value={cate.id}>
                    {cate.title}
                  </option>
                  {cate?.childs?.map((chCate) => (
                    <option key={chCate.id} value={chCate.id}>
                      {chCate.title}
                    </option>
                  ))}
                </>
              ))}
            </select> */}
            <Select
              variant='standard'
              className='category-select'
              onChange={selectedCateIdOnChange}
              value={searchInputData.categoryId}
              renderValue={renderSelectedCate}
            >
              {allCategories?.map((cate) => [
                <MenuItem key={cate.id} value={cate.id}>
                  {cate.title}
                </MenuItem>,
                cate?.childs?.map((chCate) => (
                  <MenuItem key={chCate.id} value={chCate.id}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{chCate.title}
                  </MenuItem>
                )),
              ])}
            </Select>
            <input
              placeholder='Tìm tên sản phẩm'
              className='txt-search-product'
              type='text'
              onChange={onChangeSearchText}
              value={searchInputData.text}
            />
            <button
              type='button'
              className='btn-search'
              onClick={onClickSearch}
            >
              <div>
                <IconSearch />
              </div>
            </button>
          </div>
          <div
            style={{
              flex: 1.5,
            }}
            className='flex justify-end items-center'
          >
            {currentUser ? (
              <HeaderUserInfo currentUser={currentUser} />
            ) : isCurrentUserLoading ? (
              <div className='circle-loader'></div>
            ) : (
              <NavLink
                // style={{ marginRight: '2rem' }}
                to={`/login?retRef=${location.pathname + location.search}`}
              >
                Sign in
                <IconLogin style={{ marginLeft: '0.5rem' }} />
              </NavLink>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
