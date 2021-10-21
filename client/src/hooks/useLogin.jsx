import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  selectCurrentUser,
  selectCurrentUserLoading,
} from 'store/user/selector'
import { getLoginUrl } from 'utils/helpers/urlHelper'
const useLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isLoggingUser = useSelector(selectCurrentUserLoading)
  const isLoggedInUser = useCallback(() => {
    if (!isLoggingUser && !currentUser?.id) {
      const loginPath = getLoginUrl(location)
      navigate(loginPath)
      return false
    }
    return true
  }, [currentUser, navigate, location, isLoggingUser])
  return { isLoggedInUser, isLoggingUser, currentUser }
}

export default useLogin
