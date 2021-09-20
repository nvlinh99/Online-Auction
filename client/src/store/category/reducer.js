import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
}

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      const { categories } = action.payload || {}
      return { ...state, categories }
    },
  },
})
export const action = slice.actions
export default slice.reducer
