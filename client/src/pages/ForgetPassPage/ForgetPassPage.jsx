import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'
import ForgetPassEmail from './ForgetPassEmail'
import ForgetPassEmailSuccess from './ForgetPassEmailSuccess'
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
  const onClicSubmitEmail = useCallback(() => {
    setCurFormStep(FORM_STEPS.INPUT_EMAIL_SUCCESS)
  }, [])

  useEffect(() => {
    if (token) {
      setCurFormStep(FORM_STEPS.CHANGE_PASSWORD)
    }
  }, [token])

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
          <IconButton onClick={onClickGoBack} variant='text'>
            <FiArrowLeft />
          </IconButton>
          <Typography variant='h5' className='text-center flex-1 !mr-10'>
            Đặt lại mật khẩu
          </Typography>
        </div>
        {curFormStep === FORM_STEPS.INPUT_EMAIL ? (
          <ForgetPassEmail
            onClicSubmitEmail={onClicSubmitEmail}
            onChangeInput={onChangeInput}
            formInputData={formInputData}
          />
        ) : curFormStep === FORM_STEPS.INPUT_EMAIL_SUCCESS ? (
          <ForgetPassEmailSuccess
            onClickGoBack={onClickGoBack}
            formInputData={formInputData}
          />
        ) : (
          <ForgetPassEmail
            onClickGoBack={onClickGoBack}
            onClicSubmitEmail={onClicSubmitEmail}
            onChangeInput={onChangeInput}
            formInputData={formInputData}
          />
        )}
      </Box>
    </div>
  )
}

export default ForgetPassPage
