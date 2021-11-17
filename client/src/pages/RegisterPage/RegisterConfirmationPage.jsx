import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import * as UserAPI from 'services/userApi'
import * as Validation from 'utils/validation'

const SucceededComp = () => (
  <>
    <Typography variant='h6' className='text-center flex-1 !mr-10'>
      Xác nhận tài khoản <span style={{ color: '#00e676' }}>THÀNH CÔNG</span>.
    </Typography>
    <Typography variant='h6' className='text-center flex-1 !mr-10'>
      <Link style={{ textDecoration: 'underline' }} to='/login'>
        đăng nhập
      </Link>
    </Typography>
  </>
)

const FailedComp = () => (
  <Typography variant='h6' className='text-center flex-1 !mr-10'>
    Xác nhận tài khoản <span style={{ color: '#ff1744' }}>THẤT BẠI</span>. Vui
    lòng thử lại!
  </Typography>
)

const RegisterConfirmationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onClickGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const status = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('status')
  }, [location.search])

  const TextComp = useMemo(() => {
    return status === 'SUCCEEDED' ? SucceededComp : FailedComp
  }, [status])
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Box
        sx={{
          margin: 'auto',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 3px 10px 0 rgb(0 0 0 / 14%)',
          width: 500,
          // height: 270,
        }}
      >
        <div className='mb-10 flex'>
          <IconButton onClick={onClickGoBack}>
            <FiArrowLeft />
          </IconButton>
          <Typography variant='h5' className='text-center flex-1 !mr-10'>
            Xác nhận email tài khoản
          </Typography>
        </div>

        <TextComp />
      </Box>
    </div>
  )
}

export default RegisterConfirmationPage
