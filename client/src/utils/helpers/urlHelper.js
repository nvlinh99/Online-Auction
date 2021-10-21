import { LOGIN_PATH } from 'constants/routeConstants'

export const getImageURL = (url = '') => {
  if (url.startsWith('http')) {
    return url
  }
  return process.env.API_URL + url
}
export const getLoginUrl = (location) => {
  if (!location) {
    return LOGIN_PATH
  }
  const loginPath = `${LOGIN_PATH}?retRef=${
    location.pathname + location.search
  }`
  return loginPath
}
