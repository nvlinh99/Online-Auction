import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
}

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      const { products } = action.payload || {}
      return { ...state, products }
    },
  },
})
export const action = slice.actions
export default slice.reducer
