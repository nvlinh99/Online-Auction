import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import IconLogin from '@mui/icons-material/Login'
import { Container } from '@mui/material'

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

// const Header = () => {
//   return (
//     <header
//       style={{
//         display: 'flex',
//         background: '#e0e0e0',
//       }}
//     >
//       <Logo />
//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           flexDirection: 'row-reverse',
//         }}
//       >
//         <NavLink
//           style={{
//             height: '2rem',
//             fontWeight: 'bold',
//             background: '#bdbdbd',
//             padding: '0 10px',
//             borderRadius: '7px',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//           to='/register'
//         >
//           <span style={{ marginBottom: '4px' }}>Sign in</span>
//         </NavLink>
//       </div>
//     </header>
//   )
// }

const Header = () => {
  const userInfo = localStorage.getItem('')
  return (
    <header
      style={{
        color: 'white',
        background: '#282A35',
      }}
    >
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ flex: '1' }} />
        <Logo />

        <div style={{ flex: '1' }}>
          <NavLink
            style={{
              float: 'right',
              display: 'inline-block',
              fontWeight: 'bold',
              // background: '#bdbdbd',
              padding: '5px 10px',
              borderRadius: '7px',
            }}
            to='/login'
          >
            Sign in
            <IconLogin style={{ marginLeft: '0.5rem' }} />
          </NavLink>
        </div>
      </Container>
    </header>
  )
}

export default Header
