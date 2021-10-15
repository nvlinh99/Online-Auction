import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectCurrentUser } from 'store/user/selector'
import { getLoginUrl } from 'utils/helpers/urlHelper'
const useLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const isLoggedInUser = useCallback(() => {
    if (!currentUser?.id) {
      const loginPath = getLoginUrl(location)
      navigate(loginPath)
      return false
    }
    return true
  }, [currentUser, navigate, location])
  return { isLoggedInUser }
}

export default useLogin
