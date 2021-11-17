import { api } from './api'
import axios from 'axios'
import _ from 'lodash'



export const upload = async (body) => {
  try {
    const { succeeded, data } = await api.post('/upload/img', body, {
      timeout: 10000,
    })
    return [succeeded, data]
  } catch (err) {
    return [false]
  }
}


export const uploadIMGBB = async (file) => {
  let body = new FormData()
  body.set('key', process.env.IMGBB_API_KEY)
  body.append('image', file)

  try {

    const res = await axios({
      method: 'post',
      url: 'https://api.imgbb.com/1/upload',
      data: body
    })

    const url = _.get(res, 'data.data.url', null);
    if (!url) return { succeeded: false, data: { message: 'Tải ảnh không thành công.'}}
    return { succeeded: true, data: { url }}
  } catch (err) {
    return { succeeded: false, data: { message: 'Tải ảnh không thành công.'}}
  }
  
}
