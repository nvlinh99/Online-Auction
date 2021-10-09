import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { StylesProvider } from '@mui/styles'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-image-gallery/styles/css/image-gallery.css'

import { ThemeProvider } from '@mui/material/styles'
import store from 'store/store'
import App from './App'
import muiTheme from 'styles/muiTheme'
const WrappedApp = () => {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <StylesProvider>
          <ThemeProvider theme={muiTheme}>
            <App />
            <ToastContainer />
          </ThemeProvider>
        </StylesProvider>
      </ReduxProvider>
    </BrowserRouter>
  )
}
ReactDOM.render(<WrappedApp />, document.getElementById('root'))
