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
    updateProduct: (state, action) => {
      const { product } = action.payload || {}
      const curProducts = [...(state.products?.items || [])]
      if (!product.id) {
        return state
      }
      const index = curProducts.findIndex((o) => o.id === product.id)
      if (index === -1) {
        return state
      }
      curProducts[index] = product
      return {
        ...state,
        products: {
          ...(state.products || {}),
          items: curProducts,
        },
      }
    },
  },
})
export const action = slice.actions
export default slice.reducer
