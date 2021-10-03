import { combineReducers } from 'redux'
import category from './category/reducer'
import user from './user/reducer'
const reducers = combineReducers({
  category,
  user,
})
export default reducers
