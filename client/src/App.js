import { Component, useMemo } from 'react'
import { useRoutes } from 'react-router-dom'
import { getRoutes } from 'routes'
import './styles/global.scss'
const App = () => {
  const userRoutes = useMemo(() => getRoutes(), [])
  const routes = useRoutes(userRoutes)

  return <div>{routes}</div>
}

export default App
