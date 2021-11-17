import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers.js'
const enhancers = []
const middleware = [thunk]

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers)

const store = createStore(reducer, {}, composedEnhancers)

function isStoreInitialized() {
  if (!store) {
    return false
  }

  return true
}

export function dispatch(action) {
  if (!isStoreInitialized()) {
    return null
  }

  return store.dispatch(action)
}

export function getState() {
  if (!isStoreInitialized()) {
    return null
  }

  return store.getState()
}

export default store
