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
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MdOutlineCategory } from 'react-icons/md'
import { ADMIN_PATH } from 'constants/routeConstants'
import classNames from 'classnames'
import {
  RiAuctionFill,
  RiDashboardFill,
  RiAccountBoxFill,
} from 'react-icons/ri'
import { GiUpgrade } from 'react-icons/gi'
const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))
const DASHBOARD_URL = ADMIN_PATH
export const adminSidebarListItems = [
  {
    url: DASHBOARD_URL,
    label: 'Trang tổng quan',
    Icon: RiDashboardFill,
  },
  {
    url: DASHBOARD_URL + '/users',
    label: 'Quản lý tài khoản',
    Icon: RiAccountBoxFill,
    subLabel: 'Thực hiện quản lý tài khoản',
  },
  {
    url: DASHBOARD_URL + '/category',
    label: 'Quản lý danh mục',
    Icon: MdOutlineCategory,
    subLabel: 'Thực hiện xem danh sách,thêm , chỉnh sửa, và xóa các danh mục',
  },
  {
    url: DASHBOARD_URL + '/products',
    label: 'Quản lý sản phẩm',
    Icon: RiAuctionFill,
    subLabel: 'Thực hiện xem danh sách và xóa sản phẩm',
  },
  {
    url: DASHBOARD_URL + '/upgrade',
    label: 'Nâng cấp tài khoản',
    Icon: GiUpgrade,
    subLabel:
      'Thực hiện xem danh sách, duyệt hoặc từ chối yêu cầu nâng cấp của người dùng',
  },
]
const Sidebar = ({ handleDrawerClose, open }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Drawer variant='permanent' open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {adminSidebarListItems.map((item) => {
          const isActive = location.pathname === item.url
          return (
            <ListItem
              button
              key={item.link}
              className={classNames(
                ' !border-solid !border-l-4 !border-transparent ',
                isActive && '!border-[#1976d2]'
              )}
              onClick={() => navigate(item.url)}
            >
              <ListItemIcon
                className={classNames(isActive && '!text-[#1976d2]')}
              >
                <item.Icon size='24px' />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={classNames(isActive && 'text-[#1976d2]')}
              />
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}

export default Sidebar
