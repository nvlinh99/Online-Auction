import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { userAPI } from 'services'
import { FiArrowLeft } from 'react-icons/fi'

const UpdatePasswordPage = () => {
  const navigate = useNavigate()
  const [formInputData, setFormInputData] = useState({
    password: '',
    confirmPassword: '',
    oldPassword: '',
  })
  const [isSubmiting, setIsSubmiting] = useState(false)

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

  const onClickUpdate = useCallback(
    async (e) => {
      e.preventDefault()
      const { password, confirmPassword, oldPassword } = formInputData
      setIsSubmiting(true)
      try {
        if (!oldPassword) {
          return toast.error('Mật khẩu củ không hợp lệ')
        }
        if (!password) {
          return toast.error('Mật khẩu không hợp lệ')
        }
        if (!confirmPassword || confirmPassword !== password) {
          return toast.error('Hai mật khẩu không trùng khớp')
        }
        const { succeeded, data: resData } = await userAPI.updatePassword({
          password,
          confirmPassword,
          oldPassword,
        })
        if (!succeeded) {
          return toast.error(resData.message)
        }
        toast.success(resData.message)
        navigate(-1)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsSubmiting(false)
      }
    },
    [formInputData]
  )

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
            Cập nhật mật khẩu
          </Typography>
        </div>
        <div className='mx-10'>
          <TextField
            className='!mb-5'
            id='outlined-basic'
            label='Mật khẩu củ'
            variant='outlined'
            fullWidth
            name='oldPassword'
            onChange={onChangeInput}
            value={formInputData.oldPassword}
            type='password'
            required
          />
          <TextField
            className='!mb-5'
            id='outlined-basic'
            label='Mật khẩu'
            variant='outlined'
            fullWidth
            name='password'
            onChange={onChangeInput}
            value={formInputData.password}
            type='password'
            required
          />
          <TextField
            className='!mb-5'
            id='outlined-basic'
            label='Nhập lại mật khẩu'
            variant='outlined'
            fullWidth
            name='confirmPassword'
            onChange={onChangeInput}
            value={formInputData.confirmPassword}
            type='password'
            required
          />
          <Button
            fullWidth
            onClick={onClickUpdate}
            variant='contained'
            disabled={isSubmiting}
          >
            Cập nhật
          </Button>
        </div>
      </Box>
    </div>
  )
}

export default UpdatePasswordPage
