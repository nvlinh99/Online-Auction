import { api } from './api'

export const getCategories = (body) => {
  return api.get('/categories?hierarchical=true', body)
}
