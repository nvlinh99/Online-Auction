import { api } from './api'

export const getTransactions = (page) => {
  return api.get(`/transactions?page=${page}`)
}

export const updateTransaction = (id, status) => {
  return api.put(`/transactions/${id}`, { status })
}
