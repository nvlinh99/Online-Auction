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
import { useLocation, useNavigate, Link } from 'react-router-dom'
import * as UserAPI from 'services/userApi'
import * as Validation from 'utils/validation'

const ForgetPassPage = () => {
  const navigate = useNavigate()
  const onClickGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConfirmPhase, setIsConfirmPhase] = useState(false)
  const formDataRef = useRef({
    email,
    firstName,
    lastName,
    address,
    password,
    confirmPassword,
  })

  const onEmailChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.email = value
      setEmail(value)
    },
    [setEmail]
  )
  const onFirstNameChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.firstName = value
      setFirstName(value)
    },
    [setFirstName]
  )
  const onLastNameChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.lastName = value
      setLastName(value)
    },
    [setLastName]
  )
  const onAddressChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.address = value
      setAddress(value)
    },
    [setAddress]
  )
  const onPasswordChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.password = value
      setPassword(value)
    },
    [setPassword]
  )
  const onConfirmPasswordChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.confirmPassword = value
      setConfirmPassword(value)
    },
    [setConfirmPassword]
  )

  const registerFail = (msg) => {
    console.log(msg)
    setTimeout(() => setLoading(false), 500)
  }
  const onSubmitRegister = useCallback(() => {
    setLoading(true)
    const body = formDataRef.current
    if (!body.email) {
      return registerFail('Yeu cau nhap email')
    }
    if (!body.firstName) {
      return registerFail('Yeu cau nhap firstName')
    }
    if (!body.lastName) {
      return registerFail('Yeu cau nhap lastName')
    }
    if (!body.address) {
      return registerFail('Yeu cau nhap address')
    }
    if (!body.password) {
      return registerFail('Yeu cau nhap password')
    }
    if (!body.confirmPassword) {
      return registerFail('Yeu cau nhap confirmPassword')
    }
    if (!Validation.isEmail(body.email)) {
      return registerFail('Email khong hop le')
    }
    return UserAPI.register(body).then((res) => {
      const [succeeded, message] = res
      if (!succeeded) return registerFail(message)
      return setIsConfirmPhase(true)
    })
  }, [formDataRef])

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
          <IconButton disabled={loading} onClick={onClickGoBack}>
            <FiArrowLeft />
          </IconButton>
          <Typography variant='h5' className='text-center flex-1 !mr-10'>
            Đăng kí tài khoản
          </Typography>
        </div>
        {isConfirmPhase ? (
          <p>Đăng kí thành công. Vui lòng mở hộp thư email xác nhận email.</p>
        ) : (
          <>
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='Email'
              variant='outlined'
              fullWidth
              type='email'
              name='email'
              onChange={onEmailChange}
              value={email}
            />
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='First Name'
              variant='outlined'
              fullWidth
              name='firstName'
              onChange={onFirstNameChange}
              value={firstName}
            />
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='Last Name'
              variant='outlined'
              fullWidth
              name='lastName'
              onChange={onLastNameChange}
              value={lastName}
            />
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='Address'
              variant='outlined'
              fullWidth
              name='address'
              onChange={onAddressChange}
              value={address}
            />
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='Password'
              type='password'
              variant='outlined'
              fullWidth
              name='password'
              onChange={onPasswordChange}
              value={password}
            />
            <TextField
              disabled={loading}
              className='!mb-5'
              id='outlined-basic'
              label='Confirm Password'
              type='password'
              variant='outlined'
              fullWidth
              name='confirmPassword'
              onChange={onConfirmPasswordChange}
              value={confirmPassword}
            />
            <Button
              disabled={loading}
              onClick={onSubmitRegister}
              className='!mb-5'
              fullWidth
              variant='contained'
            >
              Đăng kí
            </Button>
            <p style={{ textAlign: 'center' }}>
              <span>Đã có tài khoản? </span>
              <Link
                disabled={loading}
                style={{
                  [loading ? 'pointerEvents' : '']: 'none',
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
                to='/login'
              >
                Đăng nhập
              </Link>
            </p>
          </>
        )}
      </Box>
    </div>
  )
}

export default ForgetPassPage
