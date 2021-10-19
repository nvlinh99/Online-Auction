export const parseSortType = (value) => {
  if (!value || value === 'default') {
    return {}
  }
  const splitValue = value.split('|')
  if (splitValue.length !== 2) {
    return {}
  }
  return {
    [splitValue[0]]: splitValue[1],
  }
}
