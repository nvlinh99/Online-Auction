import { combineReducers } from 'redux'
import category from './category/reducer'
import user from './user/reducer'
import product from './product/reducer'
import postProdModal from './postProdModal/reducer'
const reducers = combineReducers({
  category,
  user,
  product,
  postProdModal,
})
export default reducers
