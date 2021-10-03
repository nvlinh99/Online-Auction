import { userToken } from 'constants/GlobalConstants'
import { userAPI } from 'services'
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
export const logout = async () => {
  userToken('')
  dispatch(action.logout())
}
