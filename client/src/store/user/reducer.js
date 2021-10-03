import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
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
  },
})
export const action = slice.actions
export default slice.reducer
