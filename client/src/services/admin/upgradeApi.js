import { api } from 'services/api'

const path = '/admin/upgrade'
export const getListUpgrade = (body) => {
  return api.post(`${path}/get-list`, body)
}
export const approve = ({ id, ...body }) => {
  return api.put(`${path}/approve/${id}`, body)
}
export const reject = ({ id, ...body }) => {
  return api.put(`${path}/reject/${id}`, body)
}
