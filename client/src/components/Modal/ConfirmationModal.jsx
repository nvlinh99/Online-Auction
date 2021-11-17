import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
}

export default function ConfirmationModal({
  onOK,
  onCancel,
  okText = 'Ok',
  cancelText = 'Huỷ',
  message,
  title = '',
  open,
  maxWidth = 'sm',
}) {
  const handleClose = () => {
    onCancel()
  }
  const handleOk = () => {
    onOK()
  }
  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth={maxWidth}
    >
      <BootstrapDialogTitle onClose={handleClose}>{title}</BootstrapDialogTitle>
      <DialogContent dividers>
        {typeof message === 'string' ? (
          <Typography gutterBottom>{message}</Typography>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText}</Button>
        <Button autoFocus onClick={handleOk}>
          {okText}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  )
}
