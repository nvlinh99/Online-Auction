import { api } from './api'

export const upload = async (body) => {
  try {
    const { succeeded, data } = await api.post('/upload/img', body)
    return [succeeded, data]
  } catch (err) {
    return [false]
  }
}
