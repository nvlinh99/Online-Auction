export const userToken = (value) => {
  const key = 'USER_TOKEN'
  if (typeof value === 'undefined') {
    return localStorage.getItem(key)
  }
  localStorage.setItem(key, value)
}
