export const getImageURL = (url = '') => {
  if (url.startsWith('http')) {
    return url
  }
  return process.env.API_URL + url
}
