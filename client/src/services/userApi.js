import { api } from './api'

export const register = async (body) => {
  try {
    const response = await api.post('/users/register', body)
    return [response.code === 1000, response.data.message]
  } catch (err) {
    return [false, 'Đăng kí không thành công']
  }
}
export const forgetPassword = async (body) => {
  try {
    const response = await api.post('/users/forget-pasword', body)
    return [response.code === 1000, response.data]
  } catch (err) {
    return [false, { message: 'Gửi yêu cầu thất bại' }]
  }
}
export const resetPassword = async (body) => {
  try {
    const response = await api.post('/users/reset-pasword', body)
    return [response.code === 1000, response.data]
  } catch (err) {
    return [false, { message: 'Gửi yêu cầu thất bại' }]
  }
}
