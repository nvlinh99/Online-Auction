import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
}

const slice = createSlice({
  name: 'postProdModal',
  initialState,
  reducers: {
    setOpenPostProdModal: (state, action) => {
      const { isOpen = false } = action.payload || {}
      return { ...state, isOpen }
    },
  },
})
export const action = slice.actions
export default slice.reducer
