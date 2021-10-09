import { api } from './api'

export const getProducts = (body) => {
  return api.post('/products/get-with-filter', body)
}
