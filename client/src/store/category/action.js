import { categoryAPI } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getCategoriesFromAPI = async () => {
  try {
    const res = await categoryAPI.getCategories()
    if (!res.data) {
      return
    }
    const categories = res.data
    dispatch(action.setCategories({ categories }))
  } catch (error) {
    console.error(error)
  }
}
