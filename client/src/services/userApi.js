import { api, authHeader } from './api'

export const register = async (body) => {
  try {
    const grecaptchaToken = body.grecaptchaToken
    delete body.grecaptchaToken
    const { succeeded, data } = await api.post('/users/register', body, {
      headers: { 'x-grecaptcha-token': grecaptchaToken },
    })
    return [succeeded, data.message]
  } catch (err) {
    return [false, 'Đăng kí không thành công']
  }
}

export const login = async (body) => {
  try {
    const { succeeded, data } = await api.post('/users/login', body, {
      headers: { ...authHeader() },
    })
    return [succeeded, data]
  } catch (err) {
    return [false, 'Đăng nhập không thành công']
  }
}

export const forgetPassword = async (body) => {
  return api.post('/users/forget-password', body)
}
export const resetPassword = async (body) => {
  return await api.post('/users/reset-password', body)
}
export const updatePassword = async (body) => {
  return await api.post('/users/update-password', body)
}
