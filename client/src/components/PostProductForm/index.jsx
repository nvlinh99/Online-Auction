import { useCallback, useState } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Select, MenuItem, Checkbox, CircularProgress } from '@mui/material'
import IconCancel from '@mui/icons-material/Clear'
import ReactQuill from 'react-quill'
import TextField from '@mui/material/TextField'
import DateTimePicker from '@mui/lab/DateTimePicker'
import { categorySelector } from 'store/category'
import { getCategoriesFromAPI } from 'store/category/action'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as uploadApi from 'services/uploadApi'
import * as prodcutApi from 'services/prodcutApi'

import 'react-quill/dist/quill.snow.css'
import './index.css'

const REG_ONLY_NUMER = /^[0-9,]+$/i
const validateInput = ({
  name,
  categoryId,
  description,
  startPrice,
  stepPrice,
  purchasePrice,
  avatar,
  imgList,
  expiredDate,
}) => {
  if (!name) return 'Yêu cầu nhập tên sản phẩm!'
  if (categoryId > 0 === false) return 'Yêu cầu chọn danh mục!'
  if (!description) return 'Yêu cầu nhập mô tả sản phẩm!'
  if (!description) return 'Yêu cầu nhập mô tả sản phẩm!'
  if (startPrice > 0 === false) return 'Giá khởi điểm không hợp lệ!'
  if (stepPrice > 1 === false) return 'Bước giá không hợp lệ!'
  if (purchasePrice && purchasePrice < startPrice + stepPrice)
    return 'Giá mua ngay không hợp lệ!'
  if (!avatar) return 'Yêu cầu chọn ảnh đại diện!'
  if (_.get(imgList, 'length', 0) < 3) return 'Yêu cầu chọn ít nhất 3 ảnh phụ!'
  // startPrice: joi.number().integer().required().positive().invalid(0, null),
  // stepPrice: joi.number().integer().required().positive().invalid(0, null),
  // purchasePrice: joi.number().integer().positive().invalid(0, null),
  // expiredDate: joi.date().greater('now').required().invalid(null, ''),
  // autoRenew: joi.bool().invalid(null).default(false),

  return null
}

const PostProductForm = () => {
  const now = moment()
  const [name, setName] = useState('')
  const [startPrice, setStartPrice] = useState('')
  const [stepPrice, setStepPrice] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [description, setDescription] = useState('')
  const [cateId, setCateId] = useState(-1)
  const [autoRenew, setAutoRenew] = useState(false)
  const [allowNewUser, setAllowNewUser] = useState(true)
  const [expiredDate, setExpiredDate] = useState(now.clone().add(7, 'days'))
  const [avatar, setAvatar] = useState('')
  const [imgList, setImgList] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const allCategories = useSelector(categorySelector.selectCategories)

  const clearData = useCallback(() => {
    setName('')
    setStartPrice('')
    setStepPrice('')
    setPurchasePrice('')
    setDescription('')
    setCateId(-1)
    setAutoRenew(false)
    setAllowNewUser(true)
    const next7Day = moment()
    next7Day.add(7, 'days')
    setExpiredDate(next7Day)
    setAvatar('')
    setImgList([])
  }, [])
  const onExpiredDateChange = useCallback((v) => {
    setExpiredDate(v)
  }, [])
  const onCateIdChange = useCallback((e) => {
    setCateId(+e?.target?.value)
  }, [])
  const renderSelectedCate = useCallback(
    (selectedCateId) => {
      const df = <em>Danh mục</em>
      if (selectedCateId !== '-1') {
        for (let pCate of allCategories) {
          if (pCate?.id === selectedCateId) return pCate.title || df
          if (pCate?.childs) {
            for (let chCate of pCate.childs)
              if (chCate?.id === selectedCateId) return chCate.title || df
          }
        }
      }
      return df
    },
    [allCategories]
  )
  const onChooseAvatar = useCallback(() => {
    // eslint-disable-next-line no-undef
    document.getElementById('postProAddAvatarBtn').click()
  }, [])
  const onAvatarChange = useCallback((e) => {
    setAvatar(e.target.files[0])
  }, [])

  const onChooseImgList = useCallback(() => {
    // eslint-disable-next-line no-undef
    document.getElementById('postProAddImgListBtn').click()
  }, [])
  const onImgListChange = useCallback((e) => {
    if (e.target.files.length < 3) return alert('Chọn ít nhất 3 ảnh!!')
    const list = []
    for (let i = 0; i < e.target.files.length; i++) {
      list.push(e.target.files[i])
    }
    return setImgList(list)
  }, [])

  const onNameChange = useCallback((e) => {
    setName(e.target.value)
  }, [])
  const onStartPriceChange = useCallback((e) => {
    if (!REG_ONLY_NUMER.test(e.target.value) && e.target.value !== '') return
    setStartPrice(parseInt(e.target.value) || '')
  }, [])
  const onStepPriceChange = useCallback((e) => {
    if (!REG_ONLY_NUMER.test(e.target.value) && e.target.value !== '') return
    setStepPrice(parseInt(e.target.value) || '')
  }, [])
  const onPurchasePriceChange = useCallback((e) => {
    if (!REG_ONLY_NUMER.test(e.target.value) && e.target.value !== '') return
    setPurchasePrice(parseInt(e.target.value) || '')
  }, [])
  const onAutoRenewChange = useCallback((e) => {
    setAutoRenew(e.target.checked)
  }, [])
  const onAllowNewUserChange = useCallback((e) => {
    setAllowNewUser(e.target.checked)
  }, [])

  const postingFail = (msg) => {
    toast.error(msg)
    setTimeout(() => setIsPosting(false), 100)
  }
  const onPostProd = async () => {
    setIsPosting(true)
    const payload = {
      name,
      categoryId: cateId,
      description,
      startPrice,
      stepPrice,
      purchasePrice: purchasePrice || undefined,
      expiredDate: expiredDate.toISOString(),
      autoRenew,
      allowNewUser,
    }
    const err = validateInput({ ...payload, avatar, imgList })
    if (err) return postingFail(err)

    const jobs = []
    jobs.push(uploadApi.uploadIMGBB(avatar))
    for (let i = 0; i < imgList.length; i++) {
      jobs.push(uploadApi.uploadIMGBB(imgList[i]))
    }
    let [avatarRes, ...imgListRes] = await Promise.all(jobs)
    if (!avatarRes.succeeded)
      return postingFail('Đăng sản phẩm thất bại. Vui lòng thử lại!')
    for (const res of imgListRes) {
      if (!res.succeeded)
        return postingFail('Đăng sản phẩm thất bại. Vui lòng thử lại!')
    }
    payload.avatarUrl = avatarRes.data.url
    payload.imageUrls = _.map(imgListRes, 'data.url')
    try {
      const { succeeded, data } = await prodcutApi.postProducts(payload)
      console.log(data)
      if (!succeeded)
        return postingFail(
          _.get(data, 'message', 'Đăng sản phẩm thất bại. Vui lòng thử lại!')
        )
    } catch (err) {
      return postingFail('Đăng sản phẩm thất bại. Vui lòng thử lại!')
    }

    toast.success('Đăng sản phẩm thành công')
    setIsPosting(false)
    clearData()
  }

  return (
    <div className='post-prod-form '>
      <p className='post-prod-title'>ĐĂNG BÁN SẢN PHẨM</p>
      <input
        value={name}
        onChange={onNameChange}
        className='txt-post-prod-input mr-8'
        placeholder='Nhập tên sản phẩm'
        type='text'
        required
      />
      <Select
        className='mr-8'
        style={{
          marginBottom: '15px',
          padding: '10px',
          width: '250px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
        }}
        variant='standard'
        // className='category-select'
        onChange={onCateIdChange}
        value={cateId}
        renderValue={renderSelectedCate}
      >
        {allCategories?.map((cate) => [
          <MenuItem key={cate.id} value={cate.id}>
            {cate.title}
          </MenuItem>,
          cate?.childs?.map((chCate) => (
            <MenuItem key={chCate.id} value={chCate.id}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{chCate.title}
            </MenuItem>
          )),
        ])}
      </Select>
      <input
        value={startPrice}
        onChange={onStartPriceChange}
        className='txt-post-prod-input mr-8 post-pro-btn-price'
        placeholder='Nhập giá khởi điểm (VND)'
        type='number'
        onWheel={(e) => e.target.blur()}
        required
      />
      <input
        value={stepPrice}
        onChange={onStepPriceChange}
        className='txt-post-prod-input mr-8 post-pro-btn-price'
        placeholder='Nhập bước giá (VND)'
        type='number'
        onWheel={(e) => e.target.blur()}
        required
      />
      <input
        value={purchasePrice}
        onChange={onPurchasePriceChange}
        className='txt-post-prod-input mr-8 post-pro-btn-price'
        placeholder='Nhập giá mua ngay (VND)'
        type='number'
        onWheel={(e) => e.target.blur()}
        required
      />
      <DateTimePicker
        label='Thời gian hết hạn'
        value={expiredDate}
        minDateTime={now.clone().add(10, 'minutes')}
        onChange={onExpiredDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
      <lable className='ml-6'>
        <Checkbox onChange={onAutoRenewChange} checked={autoRenew} />
        Tự động gia hạn
      </lable>
      <lable className='ml-6'>
        <Checkbox onChange={onAllowNewUserChange} checked={allowNewUser} />
        Cho phép người mới đấu giá
      </lable>
      <ReactQuill
        value={description}
        onChange={setDescription}
        theme='snow'
        className='mt-4'
        style={{
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
        }}
      />
      <input
        onChange={onAvatarChange}
        type='file'
        accept='image/png, image/jpeg'
        id='postProAddAvatarBtn'
        style={{ display: 'none' }}
      />
      <button
        style={{
          height: '40px',
          padding: '0 10px',
          color: '#fff',
          background: 'rgb(38, 149, 255)',
          fontWeight: 'bold',
          borderRadius: '20px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
        }}
        className='mt-7 mr-10 mb-2'
        click
        type='button'
        onClick={onChooseAvatar}
      >
        Chọn ảnh đại diện
      </button>
      <div
        style={{
          width: '100%',
        }}
      >
        <div
          style={{
            display: avatar ? 'block' : 'none',
            width: '400px',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
          }}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            src={avatar ? URL.createObjectURL(avatar) : ''}
          />
        </div>
      </div>

      <input
        onChange={onImgListChange}
        type='file'
        multiple
        accept='image/png, image/jpeg'
        id='postProAddImgListBtn'
        style={{ display: 'none' }}
      />
      <button
        style={{
          height: '40px',
          padding: '0 10px',
          color: '#fff',
          background: 'rgb(38, 149, 255)',
          fontWeight: 'bold',
          borderRadius: '20px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
        }}
        className='mt-7 mr-10'
        click
        type='button'
        onClick={onChooseImgList}
      >
        Chọn Ít nhất 3 ảnh phụ
      </button>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {imgList &&
          !!imgList.length &&
          imgList.map((img) => (
            <div
              key={img.name}
              style={{
                width: '30%',
                minWidth: '200px',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                marginTop: '10px',
              }}
            >
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                src={img ? URL.createObjectURL(img) : ''}
              />
            </div>
          ))}
      </div>
      <div className='flex justify-center' style={{ width: '100%' }}>
        <button
          style={{
            width: '230px',
            height: '60px',
            color: '#fff',
            background: 'rgb(38, 149, 255)',
            fontWeight: 'bold',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
            fontSize: '22px',
          }}
          className='mt-7 mr-10'
          type='button'
          onClick={onPostProd}
        >
          {isPosting ? <Spinner /> : 'ĐĂNG SẢN PHẨM'}
        </button>
      </div>
      {isPosting && (
        <div
          style={{
            zIndex: 99,
            position: 'absolute',
            width: '100%',
            height: '100%',
            marginLeft: '-30px',
            background: 'rgba(0,0,0,0.5)',
          }}
        ></div>
      )}
    </div>
  )
}
const Spinner = ({ style = {} }) => {
  const cpStyle = {}
  if (style) {
    const { cpWidth, cpHeight } = style
    if (cpWidth) cpStyle.width = cpWidth
    if (cpHeight) cpStyle.height = cpHeight
  }
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CircularProgress style={cpStyle} />
    </div>
  )
}
export default PostProductForm
