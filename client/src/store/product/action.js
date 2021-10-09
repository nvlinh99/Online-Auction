import { productAPI } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getCategoriesFromAPI = async (body) => {
  try {
    const { succeeded, data } = await productAPI.getProducts(body)
    if (!succeeded) {
      return
    }
    dispatch(action.setProducts(data))
  } catch (error) {
    console.error(error)
  }
}
