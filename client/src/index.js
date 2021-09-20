import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { StylesProvider } from '@mui/styles'

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
          </ThemeProvider>
        </StylesProvider>
      </ReduxProvider>
    </BrowserRouter>
  )
}
ReactDOM.render(<WrappedApp />, document.getElementById('root'))
