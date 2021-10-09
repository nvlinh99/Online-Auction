import { productAPI } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getProductsFromAPI = async (body) => {
  try {
    const { succeeded, data } = await productAPI.getProducts(body)
    if (!succeeded) {
      return
    }
    dispatch(action.setProducts({ products: data }))
  } catch (error) {
    console.error(error)
  }
}
