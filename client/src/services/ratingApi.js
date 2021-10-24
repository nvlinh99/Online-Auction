import { api } from './api'

export const rating = (body) => {
  return api.post('/rating', body)
}
