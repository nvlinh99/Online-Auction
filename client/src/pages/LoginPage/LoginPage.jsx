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

// Utils
import { createCookie, getErrorMessage } from '../../utils/helpers/cookie'

const LoginPage = () => {
  const navigate = useNavigate()
  const onClickGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConfirmPhase, setIsConfirmPhase] = useState(false)
  const formDataRef = useRef({
    email,
    password,
  })

  const onEmailChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.email = value
      setEmail(value)
    },
    [setEmail]
  )

  const onPasswordChange = useCallback(
    (e) => {
      const { value } = e.target
      formDataRef.current.password = value
      setPassword(value)
    },
    [setPassword]
  )

  const loginFail = (msg) => {
    toast.error(msg)
    setTimeout(() => setLoading(false), 500)
  }

  const onSubmitLogin = useCallback(() => {
    setLoading(true)
    const body = formDataRef.current
    const errMsg = inputValidation(body)
    if (errMsg) return loginFail(errMsg)
    return UserAPI.login(body).then((res) => {
      const [succeeded, message, token] = res
      console.log(token)
      if (!succeeded) {
        return loginFail(message)
      }
      createCookie(TOKEN_KEY, token)
      history.push('/')
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
            Đăng nhập
          </Typography>
        </div>
        {isConfirmPhase ? (
          <p>Đăng nhập thành công.</p>
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
              label='Mật khẩu'
              type='password'
              variant='outlined'
              fullWidth
              name='password'
              onChange={onPasswordChange}
              value={password}
            />
            <Button
              disabled={loading}
              onClick={onSubmitLogin}
              className='!mb-5'
              fullWidth
              variant='contained'
            >
              Đăng nhập
            </Button>
            <p style={{ textAlign: 'center' }}>
              <span>Chưa có tài khoản? </span>
              <Link
                disabled={loading}
                style={{
                  [loading ? 'pointerEvents' : '']: 'none',
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
                to='/register'
              >
                Đăng ký
              </Link>
            </p>
            <p style={{ textAlign: 'center' }}>
              <Link
                disabled={loading}
                style={{
                  [loading ? 'pointerEvents' : '']: 'none',
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
                to='/forget-password'
              >
                Quên mật khẩu
              </Link>
            </p>
          </>
        )}
      </Box>
    </div>
  )
}

export default LoginPage

const inputValidation = (data) => {
  if (!data.email) {
    return 'Yêu cầu nhập email'
  }
  if (!data.password) {
    return 'Yêu cầu nhập mật khẩu'
  }
  if (!Validation.isEmail(data.email)) {
    return 'Email không hợp lệ'
  }
  return null
}
