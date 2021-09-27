import { api } from './api'

export const register = async (body) => {
  try {
    const response = await api.post('/users/register', body)
    console.log(response)
    return [response.code === 1000, response.data.message]
  } catch (err) {
    return [false, 'Đăng kí không thành công']
  }
}
