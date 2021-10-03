import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import IconLogin from '@mui/icons-material/Login'
import { Container } from '@mui/material'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectCurrentUserLoading,
} from 'store/user/selector'
import HeaderUserInfo from './HeaderUserInfo'

const Logo = () => {
  return (
    <Link
      to='/'
      style={{
        display: 'block',
        padding: '0.8rem',
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
  const currentUser = useSelector(selectCurrentUser)
  const isCurrentUserLoading = useSelector(selectCurrentUserLoading)
  return (
    <header
      style={{
        color: 'white',
        background: '#282A35',
      }}
    >
      <Container>
        <div className='flex justify-between'>
          <Logo />
          <div className='flex items-center'>
            {currentUser ? (
              <HeaderUserInfo currentUser={currentUser} />
            ) : isCurrentUserLoading ? (
              <div className='circle-loader'></div>
            ) : (
              <NavLink
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
