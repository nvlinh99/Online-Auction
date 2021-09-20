import { api } from './api'

export const getCategories = (body) => {
  return api.get('/posts', body)
}
