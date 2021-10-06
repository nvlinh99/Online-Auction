import { userToken } from 'constants/GlobalConstants'
import React, { Component, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useRoutes } from 'react-router-dom'
import { getRoutes } from 'routes'
import { getCurrentUserFromAPI } from 'store/user/action'
import { selectCurrentUser } from 'store/user/selector'

import 'styles/global.scss'
const App = () => {
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
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
  return <div style={{ height: '100%' }}>{routes}</div>
}

export default App
