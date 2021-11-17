import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isCurrentUserLoading: false,
  isTogglingWatchList: '',
  isWaitingForLoadUser: true,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const { currentUser } = action.payload || {}
      return { ...state, currentUser, isWaitingForLoadUser: false }
    },
    setIsWaitingForLoadUser: (state, action) => {
      const { isWaitingForLoadUser } = action.payload || {}
      return { ...state, isWaitingForLoadUser: false }
    },
    logout: (state, action) => {
      return { ...state, currentUser: undefined }
    },
    setCurrentUserLoading: (state, action) => {
      const { isLoading } = action.payload || {}
      return { ...state, isCurrentUserLoading: isLoading }
    },
    setIsTogglingWatchList: (state, action) => {
      const { productId } = action.payload || {}
      return { ...state, isTogglingWatchList: productId }
    },
  },
})
export const action = slice.actions
export default slice.reducer
