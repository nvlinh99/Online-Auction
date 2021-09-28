import React, { Component, useMemo } from 'react'
import { useRoutes } from 'react-router-dom'
import { getRoutes } from 'routes'

import 'styles/global.scss'
const App = () => {
  const userRoutes = useMemo(() => getRoutes(), [])
  const routes = useRoutes(userRoutes)
  console.log(process.env.API_URL)

  return <div>{routes}</div>
}

export default App