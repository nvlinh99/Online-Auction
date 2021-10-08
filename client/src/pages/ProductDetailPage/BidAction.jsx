import { useCallback, useState } from 'react'
import numeral from 'numeral'
import _ from 'lodash'
import './index.css'

const BidAction = ({ initBidPrice, stepPrice }) => {
  const formatedInitPrice = numeral(initBidPrice).format('0,0')
  const [price, setPrice] = useState(formatedInitPrice)
  const [isSmallerPrice, setIsSmallerPrice] = useState(false)

  const checkValidValue = useCallback(
    (v) => {
      v = numeral(v).value()
      v = _.toInteger(v)
      if (_.isInteger(v) === false || v > 0 === false) return [1, null]
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
  return (
    <div className='bid-action-container'>
      <input
        className={isSmallerPrice ? 'bid-price-input-err' : 'bid-price-input'}
        type='text'
        value={price}
        min={initBidPrice}
        onChange={onPriceChange}
      />
      {isSmallerPrice && (
        <p className='bid-price-err-txt'>
          <em>Yêu cầu giá ít nhất là {formatedInitPrice} VND</em>
        </p>
      )}
    </div>
  )
}

export default BidAction
