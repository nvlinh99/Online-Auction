import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { NavLink, Outlet } from 'react-router-dom'
import HeaderUserInfo from 'Layouts/MainLayout/HeaderUserInfo'
const drawerWidth = 240
import IconLogin from '@mui/icons-material/Login'

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))
const Header = ({
  handleDrawerOpen,
  open,
  currentUser = {},
  isLoggingUser,
}) => {
  return (
    <AppBar position='fixed' open={open}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <div className='flex items-center flex-1  justify-between'>
          <Typography variant='h6' noWrap component='div'>
            Admin Dashboard
          </Typography>
          {currentUser ? (
            <HeaderUserInfo currentUser={currentUser} />
          ) : isLoggingUser ? (
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
      </Toolbar>
    </AppBar>
  )
}

export default Header
