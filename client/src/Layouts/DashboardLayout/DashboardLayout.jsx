import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import useLogin from 'hooks/useLogin'
import { useEffect } from 'react'
import { USER_ROLE } from 'constants/userConstants'

const DashboardLayout = () => {
  const { currentUser, isLoggingUser, isLoggedInUser } = useLogin()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    if (isLoggedInUser(USER_ROLE.ADMIN)) {
      return
    }
  }, [isLoggedInUser])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerOpen={handleDrawerOpen}
        open={open}
        currentUser={currentUser}
        isLoggingUser={isLoggingUser}
      />
      <Sidebar handleDrawerClose={handleDrawerClose} open={open} />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout
