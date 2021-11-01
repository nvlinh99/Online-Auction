import { api } from 'services/api'

const path = '/admin/categories'
export const getListCategories = (body) => {
  return api.post(`${path}/get-list`, body)
}
export const add = (body) => {
  return api.post(`${path}/add`, body)
}
export const update = ({ id, ...body }) => {
  return api.put(`${path}/update/${id}`, body)
}
export const deleteCat = ({ id, ...body }) => {
  return api.delete(`${path}/delete/${id}`, body)
}
