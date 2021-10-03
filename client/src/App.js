import { userToken } from 'constants/GlobalConstants'
import React, { Component, useMemo, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { getRoutes } from 'routes'
import { getCurrentUserFromAPI } from 'store/user/action'

import 'styles/global.scss'
const App = () => {
  const userRoutes = useMemo(() => getRoutes(), [])
  const routes = useRoutes(userRoutes)
  const token = userToken()
  useEffect(() => {
    if (token) {
      getCurrentUserFromAPI()
    }
  }, [token])
  return <div id='layoutContainer'>{routes}</div>
}

export default App
