import { dispatch } from 'store/store'
import { action } from './reducer'

export const openModal = () => {
  dispatch(action.setOpenPostProdModal({ isOpen: true }))
}

export const closeModal = () => {
  dispatch(action.setOpenPostProdModal({ isOpen: false }))
}
