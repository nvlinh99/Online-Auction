import React from 'react'
import { Button, Typography, TextField, Box, IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'
import PropTypes from 'prop-types'

const ForgetPassEmail = ({
  onChangeInput,
  formInputData,
  onClicSubmitEmail,
  isSubmiting,
}) => {
  return (
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
      <Button
        fullWidth
        onClick={onClicSubmitEmail}
        variant='contained'
        disabled={isSubmiting}
      >
        Tiếp theo
      </Button>
    </div>
  )
}
ForgetPassEmail.defaultProps = {
  formInputData: {
    email: '',
  },
}
ForgetPassEmail.propTypes = {
  formInputData: PropTypes.shape({
    email: PropTypes.string,
  }),
  onChangeInput: PropTypes.func,
  onClicSubmitEmail: PropTypes.func,
}
export default ForgetPassEmail
