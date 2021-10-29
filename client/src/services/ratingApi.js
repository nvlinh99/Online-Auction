import { api } from './api'

export const rating = (body) => {
  delete body.userId
  return api.post('/rating', body)
}
export const getUserRating = (body) => {
  return api.post('/rating/get-user-rating', body)
}
