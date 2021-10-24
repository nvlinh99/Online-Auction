import { api } from './api'

export const getNotiList = async (page) => {
  return api.get(`/notifications?page=${page}`)
}

export const readNoti = async (id, all) => {
  const data = {}

  if (all) {
    data.all = true
  } else if (id) {
    data.notiId = id
  } else {
    return null
  }

  return api.put('/notifications/read', data)
}
