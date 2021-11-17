import { api } from 'services/api'

const path = '/admin/products'

export const deleteProduct = ({ id, ...body }) => {
  return api.delete(`${path}/${id}`, body)
}
