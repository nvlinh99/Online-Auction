import { api } from './api'

export const getProducts = (body) => {
  return api.post('/products/get-with-filter', body)
}

export const postProducts = (body) => {
  return api.post('/products', body)
}
export const bidProduct = (body) => {
  return api.post('/bids', body)
}
