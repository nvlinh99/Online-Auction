import { userToken } from 'constants/GlobalConstants'
import { userAPI } from 'services'
import { dispatch } from 'store/store'
import { action } from './reducer'

export const getCurrentUserFromAPI = async () => {
  try {
    const { succeeded, data } = await userAPI.getCurrentUser()
    if (!succeeded) {
      return
    }
    const { currentUser } = data
    dispatch(action.setCurrentUser({ currentUser }))
  } catch (error) {
    console.error(error)
  }
}
export const logout = async () => {
  userToken('')
  dispatch(action.logout())
}
