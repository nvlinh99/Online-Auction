import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  selectCurrentUser,
  selectCurrentUserLoading,
  selectIsWaitingForLoadUser,
} from 'store/user/selector'
import { getLoginUrl } from 'utils/helpers/urlHelper'
const useLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isLoggingUser = useSelector(selectCurrentUserLoading)
  const isWaitingForLoadUser = useSelector(selectIsWaitingForLoadUser)
  const isLoggedInUser = useCallback(
    (role) => {
      console.log({ isLoggingUser, isWaitingForLoadUser, currentUser })
      if (isLoggingUser || isWaitingForLoadUser) {
        return true
      }
      if ((role || role === 0) && currentUser?.role === role) {
        return true
      }

      if (currentUser) {
        return true
      }

      const loginPath = getLoginUrl(location)
      navigate(loginPath)
      return false
    },
    [isLoggingUser, isWaitingForLoadUser, currentUser, location, navigate]
  )
  return { isLoggedInUser, isLoggingUser, currentUser }
}

export default useLogin
