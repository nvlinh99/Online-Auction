import axios from 'axios'
import qs from 'qs'
import { logout } from 'store/user/action'
import { getLoginUrl } from 'utils/helpers/urlHelper'
import { userToken } from '../constants/GlobalConstants'

export function authHeader() {
  // return authorization header with jwt token
  const token = userToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...authHeader(),
  }
  return config
})

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { code, data } = response.data || {}
    return { succeeded: code === 1000, data }
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 401) {
      logout()
      location.href = getLoginUrl(location)
      return {}
    }
    return Promise.reject(error)
  }
)
