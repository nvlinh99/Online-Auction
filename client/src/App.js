import { userToken } from 'constants/GlobalConstants'
import React, { Component, useMemo, useEffect } from 'react'
import { Modal, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { useLocation, useRoutes } from 'react-router-dom'
import { getRoutes } from 'routes'
import { getCurrentUserFromAPI } from 'store/user/action'
import { selectCurrentUser } from 'store/user/selector'
import { openModal, closeModal } from 'store/postProdModal/action'
import { selectIsOpenPostProdModal } from 'store/postProdModal/selector'
import { USER_ROLE } from 'constants/userConstants'
import PostProductForm from 'components/PostProductForm'
import IconCancel from '@mui/icons-material/Clear'

import 'styles/global.scss'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  maxWidth: '80%',
  height: '90%',
  // height: '500px',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 0,
}

const App = () => {
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const isOpenModal = useSelector(selectIsOpenPostProdModal)
  const userRoutes = useMemo(
    () => getRoutes({ currentUser, location }),
    [currentUser, location]
  )
  const routes = useRoutes(userRoutes)
  const token = userToken()
  useEffect(() => {
    if (token) {
      getCurrentUserFromAPI()
    }
  }, [token])
  return (
    <div style={{ height: '100%' }}>
      {routes}
      {currentUser && currentUser.role === USER_ROLE.SELLER && (
        <Modal
          open={isOpenModal}
          onClose={closeModal}
          // aria-labelledby='modal-modal-title'
          // aria-describedby='modal-modal-description'
        >
          <Box sx={modalStyle}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflowY: 'auto',
              }}
            >
              <PostProductForm />
            </div>
            <button
              style={{ position: 'absolute', top: '10px', right: '20px' }}
              onClick={closeModal}
            >
              <IconCancel fontSize='large' />
            </button>
          </Box>
        </Modal>
      )}
    </div>
  )
}

export default App
