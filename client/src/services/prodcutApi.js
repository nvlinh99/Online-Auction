import { api } from './api'

export const getProducts = (body) => {
  return api.get('/products/get-with-filter', body)
}
