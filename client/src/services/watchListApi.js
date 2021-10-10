import { api, authHeader } from './api'

export const toggleWatchList = async (body) => {
  return await api.post('/watchlist/toggle', body)
}
