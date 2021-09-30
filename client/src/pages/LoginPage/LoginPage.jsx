import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Button,
  Typography,
  TextField,
  Box,
  FormControlLabel,
  Alert,
  Checkbox,
} from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { login } from 'services/userApi'
import qs from 'querystring'
import { toast } from 'react-toastify'
import { HOME_PATH } from 'constants/routeConstants'

export default function LoginView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [loginStatus, setLoginStatus] = useState({
    loading: false,
    error: null,
    success: false,
  })
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    rememeber: false,
    submiting: false,
  })
  const [formError, setFormErrors] = useState({
    email: '',
    password: '',
    submiting: '',
  })

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === 'remember') {
      setFormValues({ ...formValues, [name]: checked })
      return
    }
    setFormValues({ ...formValues, [name]: value })
  }
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const { email, password, remember } = formValues

    setLoginStatus({
      error: null,
      success: false,
      loading: true,
    })
    try {
      const [succeeded, data] = await login({ email, password })
      if (!succeeded) {
        setLoginStatus({
          error: 'Email hoặc mật khẩu không hợp lệ.',
          success: false,
          loading: false,
        })
        return
      }
      const result = data || {}
      setLoginStatus({
        error: null,
        success: true,
        loading: false,
      })
      if (result.token) {
        localStorage.setItem('USER_TOKEN', result.token)
        localStorage.setItem('USER_INFO', JSON.stringify(result.user))
        if (remember) {
          localStorage.setItem('EMAIL', email)
          localStorage.setItem('PASSWORD', password)
        }

        const { retRef } = qs.parse(location.search.slice(1))
        toast.success('Đăng nhập thành công', null, 1500)
        navigate(retRef || HOME_PATH)
      }
    } catch (error) {
      setLoginStatus({
        error: error.toString(),
        success: false,
        loading: false,
      })
    }
  }
  useEffect(() => {
    const email = localStorage.getItem('EMAIL')
    const password = localStorage.getItem('PASSWORD')
    setFormValues({ email, password })
  }, [])

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
          <Typography variant='h5' className='text-center flex-1 !mr-10'>
            Đăng nhập
          </Typography>
        </div>
        {loginStatus.error && (
          <Alert severity='error'>{loginStatus.error}</Alert>
        )}
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
          autoComplete='email'
          autoFocus
          value={formValues.email}
          onChange={handleChange}
          helperText={formError.email}
          error={!!formError.email}
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='password'
          label='Mật khẩu'
          type='password'
          id='password'
          autoComplete='current-password'
          value={formValues.password}
          onChange={handleChange}
          helperText={formError.password}
          error={!!formError.password}
        />
        <FormControlLabel
          control={
            <Checkbox
              name='remember'
              value='true'
              color='primary'
              checked={formValues.remember}
              onChange={handleChange}
            />
          }
          label='Ghi nhớ tôi'
        />
        <Button
          disabled={loading}
          onClick={handleSubmit}
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
      </Box>
    </div>
  )
}
