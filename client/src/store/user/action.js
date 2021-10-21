import { userToken } from 'constants/GlobalConstants'
import { toast } from 'react-toastify'
import { userAPI, watchListApi } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getCurrentUserFromAPI = async () => {
  try {
    dispatch(action.setCurrentUserLoading({ isLoading: true }))
    const { succeeded, data } = await userAPI.getCurrentUser()
    if (!succeeded) {
      return
    }
    const { currentUser } = data
    dispatch(action.setCurrentUser({ currentUser }))
  } catch (error) {
    console.error(error)
  } finally {
    dispatch(action.setCurrentUserLoading({ isLoading: false }))
  }
}
export const toggleWatchListFromApi = async ({ productId }, cb) => {
  dispatch(action.setIsTogglingWatchList({ productId }))
  try {
    const { succeeded, data } = await watchListApi.toggleWatchList({
      productId,
    })
    if (!succeeded) {
      return toast.error(data.message)
    }
    await getCurrentUserFromAPI()
    cb?.()
    toast.success(data.message)
  } catch (error) {
    toast.error(error.message)
  } finally {
    dispatch(action.setIsTogglingWatchList({ productId: '' }))
  }
  return true
}
export const logout = async () => {
  userToken('')
  dispatch(action.logout())
}
