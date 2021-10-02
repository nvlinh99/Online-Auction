import { categoryAPI } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getCategoriesFromAPI = async () => {
  try {
    const { succeeded, data } = await categoryAPI.getCategories()
    if (!succeeded) {
      return
    }
    const categories = data.categories
    dispatch(action.setCategories({ categories }))
  } catch (error) {
    console.error(error)
  }
}
