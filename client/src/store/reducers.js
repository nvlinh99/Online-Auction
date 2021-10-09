import { combineReducers } from 'redux'
import category from './category/reducer'
import user from './user/reducer'
import product from './product/reducer'
const reducers = combineReducers({
  category,
  user,
  product,
})
export default reducers
