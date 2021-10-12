import { api } from './api'

export const getProducts = (body) => {
  return api.post('/products/get-with-filter', body)
}

export const postProducts = (body) => {
  return api.post('/products', body)
}
