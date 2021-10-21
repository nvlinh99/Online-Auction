import { api, authHeader } from './api'

export const toggleWatchList = async (body) => {
  return await api.post('/watchlist/toggle', body)
}
export const getWatchList = async (body) => {
  return await api.get('/watchlist/get-list', body)
}
