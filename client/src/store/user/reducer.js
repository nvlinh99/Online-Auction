import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isCurrentUserLoading: false,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const { currentUser } = action.payload || {}
      return { ...state, currentUser }
    },
    logout: (state, action) => {
      return { ...state, currentUser: undefined }
    },
    setCurrentUserLoading: (state, action) => {
      const { isLoading } = action.payload || {}
      return { ...state, isCurrentUserLoading: isLoading }
    },
  },
})
export const action = slice.actions
export default slice.reducer
