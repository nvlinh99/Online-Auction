import { api } from './api'

export const upgradeToSeller = (body) => {
  return api.post('/bidders/upgrade-to-seller', body)
}
export const getBiddingProducts = async (body) => {
  return await api.post('/bidders/get-bidding-products', body)
}
export const getWonProducts = async (body) => {
  return await api.post('/bidders/get-won-products', body)
}
