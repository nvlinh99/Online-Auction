import axios from 'axios'
import { readCookie, eraseCookie } from '../utils/helpers/cookie';

export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})
export const TOKEN_KEY = 'token';
//config send request header
api.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = readCookie(TOKEN_KEY);
			console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { code, data } = response.data || {}
    return { succeeded: code === 200, data }
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)