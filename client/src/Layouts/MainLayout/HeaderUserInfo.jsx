import { Avatar, Button, Fade, ClickAwayListener } from '@mui/material'
import _ from 'lodash'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { useMemo } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { logout } from 'store/user/action'
import { LOGIN_PATH } from 'constants/routeConstants'
import { USER_ROLE } from 'constants/userConstants'
import { FavoriteBorder, Favorite } from '@mui/icons-material'

const HeaderUserInfo = ({ currentUser }) => {
  const navigate = useNavigate()
  const firstLetter = useMemo(
    () => currentUser?.firstName?.[0]?.toUpperCase(),
    [currentUser]
  )
  const fullName = useMemo(
    () => currentUser?.firstName + ' ' + currentUser?.lastName,
    [currentUser]
  )
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const onLogout = () => {
    handleClose()
    logout()
    navigate(LOGIN_PATH)
  }
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className='flex items-center'>
        <div
          className='flex items-center hover:cursor-pointer'
          onClick={handleClick}
        >
          <Avatar className='mr-2'>{firstLetter}</Avatar>
          <span>{fullName}</span>
          <KeyboardArrowDownIcon />
        </div>
        <Menu
          autoFocus={false}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              // width: '150px',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <PersonIcon />
            Thông tin
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/user/watchlist')
            }}
          >
            <Favorite />
            Danh sách yêu thích
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout}>
            <LogoutIcon />
            Đăng xuất
          </MenuItem>
        </Menu>
      </div>
    </ClickAwayListener>
  )
}

export default HeaderUserInfo
