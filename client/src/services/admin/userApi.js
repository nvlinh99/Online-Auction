import { api } from 'services/api'

const path = '/admin/users'
export const getListUsers = (body) => {
  return api.post(`${path}/get-list`, body)
}
export const add = (body) => {
  return api.post(`${path}/add`, body)
}
export const update = ({ id, ...body }) => {
  return api.put(`${path}/update/${id}`, body)
}
export const block = ({ id, ...body }) => {
  return api.put(`${path}/block/${id}`, body)
}
