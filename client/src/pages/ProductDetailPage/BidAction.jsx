import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import numeral from 'numeral'
import _ from 'lodash'
import './index.css'
import { toast } from 'react-toastify'
import { productAPI } from 'services'

const REG_ONLY_NUMER = /^[0-9,]+$/i

const BidAction = forwardRef(({ initBidPrice, stepPrice, product }, ref) => {
  const formatedInitPrice = numeral(initBidPrice).format('0,0')
  const [price, setPrice] = useState(formatedInitPrice)
  const [isSmallerPrice, setIsSmallerPrice] = useState(false)
  const getPrice = useCallback(() => price, [price])
  const onBid = useCallback(
    async (cb) => {
      const priceNum = _.toNumber(price || ''.split(',').join(''))
      if (priceNum < initBidPrice) {
        toast.error('Giá không hợp lệ')
        return cb && cb(false)
      }
      try {
        if (!product.id) {
          toast.error('Sản phẩm không tồn tại')
          return cb && cb(false)
        }
        const { succeeded, data } = await productAPI.bidProduct({
          productId: product.id,
          price: priceNum,
        })
        if (!succeeded) {
          toast.error(data.message)
          return cb && cb(false)
        }
        toast.success(data.message)
        return cb && cb(succeeded)
      } catch (error) {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!')
        return cb && cb(false)
      }
    },
    [price]
  )
  useImperativeHandle(ref, () => ({
    onBid,
    getPrice,
  }))
  const checkValidValue = useCallback(
    (v) => {
      const passReg = REG_ONLY_NUMER.test(v)
      v = numeral(v).value()
      v = _.toInteger(v)
      if (!passReg || _.isInteger(v) === false || v > 0 === false)
        return [1, null]
      if (v >= initBidPrice === false) return [2, v]
      return [3, v]
    },
    [initBidPrice]
  )

  const onPriceChange = useCallback(
    (e) => {
      const [code, value] = checkValidValue(e.target.value)
      if (code === 1) return
      if (code === 2) setIsSmallerPrice(true)
      if (code === 3) setIsSmallerPrice(false)
      setPrice(numeral(value).format('0,0'))
    },
    [checkValidValue]
  )
  useEffect(() => {
    setPrice(initBidPrice)
  }, [initBidPrice])
  return (
    <>
      <div className='bid-action-container'>
        <input
          className={isSmallerPrice ? 'bid-price-input-err' : 'bid-price-input'}
          type='text'
          value={price}
          min={initBidPrice}
          onChange={onPriceChange}
        />
      </div>
      {isSmallerPrice && (
        <p className='bid-price-err-txt'>
          <em>Yêu cầu giá ít nhất là {formatedInitPrice} VND</em>
        </p>
      )}
    </>
  )
})
BidAction.displayName = 'BidAction'
export default BidAction
