import { api } from './api'

export const upgradeToSeller = (body) => {
  return api.post('/bidders/upgrade-to-seller', body)
}
