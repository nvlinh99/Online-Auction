import React, { useMemo, useState } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import ArrowR from '@mui/icons-material/ArrowForwardIosSharp'
import ArrowL from '@mui/icons-material/ArrowBackIosSharp'
import IconFavorit from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { Avatar } from '@mui/material'
import { formatProductList, formatProductItem } from 'utils/product-util'
import ImgList from '../ImgList'
import './index.css'
import classNames from 'classnames'
const imgSrc =
  'data:image/jpeg;base64,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'

const TimeLeft = ({ initHoursLeft, initMinutesLeft, initSecondsLeft }) => {
  const [totalSeconds, setTotalSeconds] = useState(
    initHoursLeft * 60 * 60 + initMinutesLeft * 60 + initSecondsLeft
  )

  const hoursLeft = Math.floor(totalSeconds / 3600)
  const minutesLeft = Math.floor((totalSeconds % 3600) / 60)
  const secondsLeft = (totalSeconds % 3600) % 60
  if (totalSeconds > 0)
    setTimeout(() => {
      setTotalSeconds(totalSeconds - 1)
    }, 1000)
  // setTimeout(() => {
  //   if (secondsLeft > 0) return setSe
  // }, 1000)
  return (
    <div className=' product-item-time-left text-center'>
      <div className='time-block'>
        <div>{hoursLeft > 0 ? hoursLeft : 0}</div>
        <div>
          <strong>giờ </strong>
        </div>
      </div>
      <div className='line-break'></div>

      <div className='time-block'>
        <div>{minutesLeft > 0 ? minutesLeft : 0}</div>
        <div>
          <strong>phút </strong>
        </div>
      </div>
      <div className='line-break'></div>

      <div className='time-block'>
        <div>{secondsLeft > 0 ? secondsLeft : 0}</div>
        <div>
          <strong>giây</strong>
        </div>
      </div>
    </div>
  )
}
const ProductItem = ({
  product,
  formated,
  watchList,
  onToggleWatchList,
  isTogglingWatchList,
}) => {
  product = formated ? product : formatProductItem(product)
  const {
    id,
    categoryId,
    categoryTitle,
    title,
    avatarUrl,
    formatedCurrentPrice,
    formatedPurchasePrice,
    formatedPublishedDate,
    totalBid,
    hoursLeft: initHoursLeft,
    minutesLeft: initMinutesLeft,
    secondsLeft: initSecondsLeft,
    formatedTimeLeft,
    biderName,
  } = product
  const isWatched = useMemo(() => {
    return watchList?.map((i) => i.productId).includes(product?.id)
  }, [watchList, product])
  const isToggling = isTogglingWatchList === product?.id
  return (
    // <Link to={`products/${product.id}`} className='product-item-container'>
    <div className='product-item-container'>
      <div
        style={{ position: 'relative' }}
        className='product-item-img-container'
      >
        {!!avatarUrl && <img className='product-item-img' src={avatarUrl} />}
        <TimeLeft
          initHoursLeft={initHoursLeft}
          initMinutesLeft={initMinutesLeft}
          initSecondsLeft={initSecondsLeft}
        />
        <div className='product-item-img-overlay'>
          <Link to={`/products/${id}`}>
            <button
              title='Xem chi tiết sản phẩm'
              className='product-item-to-detail-btn'
              type='button'
            >
              Chi tiết
            </button>
          </Link>
        </div>
        <div className='product-item-action-list'>
          {!!categoryTitle && (
            <Link to={`products/?categoryId=${categoryId}`}>
              <div className='product-item-cate-lable'>
                <span>{categoryTitle}</span>
              </div>
            </Link>
          )}
          <button
            type='button'
            title='Thêm vào danh sách yêu thích'
            className={classNames(
              'btn-add-watch-list hover:border-0',
              isWatched && 'border border-red-400 text-red-400'
            )}
            disabled={isToggling}
            onClick={() => onToggleWatchList(product?.id)}
          >
            {isWatched ? (
              <FavoriteIcon
                fontSize='small'
                className={isToggling && 'spin-animation'}
              />
            ) : (
              <IconFavorit
                fontSize='small'
                className={isToggling && 'spin-animation'}
              />
            )}
          </button>
        </div>
      </div>
      <Link to={`/products/${id}`} className='product-item-title'>
        {!!title && title}
      </Link>
      <div className='product-item-price-ctn'>
        <div to={`/products/${id}`} className='product-item-info-line'>
          <p>Giá hiện tại:</p>
          <p className='product-item-curr-price'>
            {!!formatedCurrentPrice && <span>{formatedCurrentPrice} </span>}
            <span>&#8363;</span>
          </p>
        </div>
        <div className='product-item-info-line'>
          <p>Giá bán ngay:</p>
          <p className='product-item-purchase-price'>
            <span>{formatedPurchasePrice || '#'} </span>{' '}
            <span>{formatedPurchasePrice ? <>&#8363;</> : ''}</span>
          </p>
        </div>
      </div>
      <div className='product-item-info-line'>
        <p>Đăng lúc:</p>
        <p className='product-item-published-date'>
          {!!formatedPublishedDate && formatedPublishedDate}
        </p>
      </div>
      <div className='product-item-info-line mb-4'>
        <p>Tổng lượt ra giá:</p>
        <p>
          <strong>{totalBid || 0}</strong> lượt
        </p>
      </div>
      <div className='product-item-bidder-line'>
        <p>Người ra giá cao nhất:</p>
        <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
          {biderName && (
            <>
              <Avatar style={{}} className='mr-2'>
                {_.toUpper(_.first(biderName)) || ''}
              </Avatar>
              <strong style={{}}>{biderName || ''}</strong>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProductItem }
