import React from 'react'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import PropTypes from 'prop-types'

const ForgetPassChange = ({
  onChangeInput,
  formInputData,
  onClickUpdate,
  isSubmiting,
}) => {
  return (
    <div className='mx-10'>
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
  )
}
ForgetPassChange.defaultProps = {
  formInputData: {
    email: '',
  },
}
ForgetPassChange.propTypes = {
  formInputData: PropTypes.shape({
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }),
  onChangeInput: PropTypes.func,
  onClicUpdate: PropTypes.func,
}
export default ForgetPassChange
