import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'
const FORM_STEPS = {
  INPUT_EMAIL: 0,
  INPUT_EMAIL_SUCCESS: 1,
  CHANGE_PASSWORD: 2,
}
const ForgetPassPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formInputData, setFormInputData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [curFormStep, setCurFormStep] = useState(FORM_STEPS.INPUT_EMAIL)
  const token = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    return token
  }, [location.search])
  //function
  const onClickGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const onChangeInput = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormInputData({ ...formInputData, [name]: value })
    },
    [formInputData]
  )
  const onClicSubmitEmail = useCallback(() => {}, [])

  useEffect(() => {
    if (token) {
      setCurFormStep(FORM_STEPS.CHANGE_PASSWORD)
    }
  }, [token])
  if (curFormStep === FORM_STEPS.INPUT_EMAIL) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Box
          sx={{
            margin: 'auto',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 3px 10px 0 rgb(0 0 0 / 14%)',
            width: 500,
            height: 270,
          }}
        >
          <div className='mb-10 flex'>
            <IconButton onClick={onClickGoBack}>
              <FiArrowLeft />
            </IconButton>
            <Typography variant='h5' className='text-center flex-1 !mr-10'>
              Đặt lại mật khẩu
            </Typography>
          </div>
          <div className='mx-10'>
            <TextField
              className='!mb-5'
              id='outlined-basic'
              label='Email'
              variant='outlined'
              fullWidth
              name='email'
              onChange={onChangeInput}
              value={formInputData.email}
            />
            <Button fullWidth onClick={onClicSubmitEmail} variant='contained'>
              Tiếp theo
            </Button>
          </div>
        </Box>
      </div>
    )
  }
  return null
}

export default ForgetPassPage
