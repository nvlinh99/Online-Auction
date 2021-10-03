import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import IconLogin from '@mui/icons-material/Login'
import { Container } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/user/selector'
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
  const currentUser = useSelector(selectCurrentUser)
  console.log(currentUser)
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
          <div className='flex'>
            {currentUser ? (
              <HeaderUserInfo currentUser={currentUser} />
            ) : (
              <NavLink to='/login'>
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
