import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'
import ForgetPassEmail from './ForgetPassEmail'
import ForgetPassEmailSuccess from './ForgetPassEmailSuccess'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { userAPI } from 'services'
import ForgetPassChange from './ForgetPassChange'
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
  const [isSubmiting, setIsSubmiting] = useState(false)
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
  const onClicSubmitEmail = useCallback(
    async (e) => {
      e.preventDefault()
      const { email } = formInputData
      setIsSubmiting(true)
      try {
        if (!email) {
          return toast.error('Email không hợp lệ')
        }
        const { succeeded, data: resData } = await userAPI.forgetPassword({
          email,
        })
        if (!succeeded) {
          return toast.error(resData.message)
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsSubmiting(false)
      }
      setCurFormStep(FORM_STEPS.INPUT_EMAIL_SUCCESS)
    },
    [formInputData]
  )
  const onClickUpdate = useCallback(
    async (e) => {
      e.preventDefault()
      console.log('rubn')
      const { password, confirmPassword } = formInputData
      setIsSubmiting(true)
      try {
        if (!password) {
          return toast.error('Mật khẩu không hợp lệ')
        }
        if (!confirmPassword || confirmPassword !== password) {
          return toast.error('Hai mật khẩu không trùng khớp')
        }
        const { succeeded, data: resData } = await userAPI.resetPassword({
          password,
          confirmPassword,
          token,
        })
        if (!succeeded) {
          return toast.error(resData.message)
        }
        toast.success(resData.message)
        navigate('/login')
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsSubmiting(false)
      }
      setCurFormStep(FORM_STEPS.INPUT_EMAIL_SUCCESS)
    },
    [formInputData, token]
  )

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
        {curFormStep === FORM_STEPS.INPUT_EMAIL ? (
          <ForgetPassEmail
            onClicSubmitEmail={onClicSubmitEmail}
            onChangeInput={onChangeInput}
            formInputData={formInputData}
            isSubmiting={isSubmiting}
          />
        ) : curFormStep === FORM_STEPS.INPUT_EMAIL_SUCCESS ? (
          <ForgetPassEmailSuccess />
        ) : (
          <ForgetPassChange
            onClickUpdate={onClickUpdate}
            onChangeInput={onChangeInput}
            formInputData={formInputData}
            isSubmiting={isSubmiting}
          />
        )}
      </Box>
    </div>
  )
}

export default ForgetPassPage
