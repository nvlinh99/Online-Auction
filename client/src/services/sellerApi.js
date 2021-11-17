import { api } from './api'

export const getBiddingProducts = async (body) => {
  return await api.post('/sellers/get-bidding-products', body)
}
export const getWonProducts = async (body) => {
  return await api.post('/sellers/get-won-products', body)
}
