import { Avatar, Button, Fade, ClickAwayListener } from '@mui/material'
import _ from 'lodash'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { useMemo, useState } from 'react'
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
import { RiUserStarFill } from 'react-icons/ri'
import ConfirmationModal from 'components/Modal/ConfirmationModal'
import { bidderApi } from 'services'
import { toast } from 'react-toastify'
import LdsLoading from 'components/Loading/LdsLoading'
const HeaderUserInfo = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
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
  const onUpgradeToSeller = async () => {
    setIsLoading(true)
    try {
      const { succeeded, data } = await bidderApi.upgradeToSeller()

      if (!succeeded) {
        toast.error(data.message)
        return
      }
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className='flex items-center'>
        <LdsLoading isFullscreen isLoading={isLoading} />

        <ConfirmationModal
          open={isOpenConfirmationModal}
          onCancel={() => setIsOpenConfirmationModal(false)}
          onOK={() => {
            setIsOpenConfirmationModal(false)
            onUpgradeToSeller()
          }}
          message={`Bạn có thật sự muốn trở thành người bán hàng?`}
          title='Trở thành nhà bán hàng'
        />
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
            <PersonIcon className='!w-5 !h-5 mr-1' />
            Thông tin
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose()
              navigate('/user/watchlist')
            }}
          >
            <Favorite className='!w-5 !h-5 mr-1' />
            Danh sách yêu thích
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsOpenConfirmationModal(true)
            }}
          >
            <RiUserStarFill className='!w-5 !h-5 mr-1' />
            Trở thành người bán
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout}>
            <LogoutIcon className='!w-5 !h-5 mr-1' />
            Đăng xuất
          </MenuItem>
        </Menu>
      </div>
    </ClickAwayListener>
  )
}

export default HeaderUserInfo
