import useCountdown from 'hooks/useCountdown'
import React, { useMemo } from 'react'
import { RiAuctionFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { getImageURL } from 'utils/helpers/urlHelper'
import { Link, useNavigate } from 'react-router-dom'
import { FavoriteBorder, Favorite } from '@mui/icons-material'
import classNames from 'classnames'
import moment from 'moment'
import hotIcon from 'assets/hot.png'
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import { RATING_TYPE } from 'constants/enumConstants'
import { useCallback } from 'react'
// const time = moment().add(10 * 60 - 10 * 60 + 10, 'seconds')
const ProducListItem = ({
  product = {},
  currentUser = {},
  onToggleWatchList,
  isTogglingWatchList,
  noWatchList,
  onClickRating,
  onClickCategory,
}) => {
  const navigate = useNavigate()
  const isWatched = useMemo(() => {
    return currentUser?.watchList?.map((i) => i.productId).includes(product?.id)
  }, [currentUser, product])
  const { countdownTime, duration } = useCountdown({
    time: product.expiredDate,
  })
  const currentPrice =
    product.currentBid?.price || product.currentPrice || product.startPrice
  const biderName = useMemo(() => {
    const bidder = product.currentBid?.bidder
    if (!bidder) {
      return 'Chưa có'
    }
    return [bidder.firstName, bidder.lastName].filter(Boolean).join(' ')
  }, [product.currentBid?.bidder])

  let pldd = null
  const diff = moment().diff(moment(product.publishedDate), 'milliseconds')
  if (diff > 0) {
    pldd = moment.duration(diff)
  }

  const isHot = useMemo(() => {
    const m = pldd.asMinutes?.()
    if (m > 0 && m < 10) {
      return true
    }
    return false
  }, [pldd])
  const handleClickCategory = useCallback(() => {
    if (onClickCategory) {
      onClickCategory(product)
      return
    }
    navigate(`/products/?categoryId=${product?.categoryInfo?.id || ''}`)
  }, [onClickCategory, navigate, product])
  return (
    <div className='relative pt-2.5 pb-8 px-2.5 shadow-product bg-white rounded-[10px]'>
      {product.categoryInfo?.title && (
        <button
          onClick={handleClickCategory}
          className='z-10  rounded-r-[4px] shadow-product  flex-center text-white bg-gradient-to-tl from-[#f22876] to-[#942dd9] absolute top-4 left-[-3px] max-w-[150px] h-[24px] px-2 py-1    inline-block duration-300 ease-linear transform-gpu'
        >
          <span
            className='border-[#942dd9] absolute inline-block left-0 bottom-[-3px] border-t-[3px] border-l-[3px] border-l-[transparent] filter brightness-50'
            z-10
          />
          <span className='overflow-hidden text-xs overflow-ellipsis whitespace-nowrap'>
            {product.categoryInfo.title}
          </span>
        </button>
      )}
      <div className='relative rounded-[10px] overflow-hidden bg-[#f6f6ff] justify-center items-center flex '>
        <Link
          to={`/products/${product.id}`}
          className='block bg-transparent aspect-w-1 aspect-h-1 w-full'
        >
          <img
            src={getImageURL(product.avatarUrl)}
            alt={product.name}
            className=''
          />
        </Link>

        {!noWatchList && (
          <button
            disabled={isTogglingWatchList === product.id}
            onClick={() => onToggleWatchList(product)}
            className={classNames(
              'flex-center text-white bg-gradient-to-tl from-[#f22876] to-[#942dd9] absolute top-2 right-2 w-[36px] h-[36px] rounded-full inline-block duration-300 ease-linear transform-gpu',
              isTogglingWatchList === product.id && 'spin-animation'
            )}
          >
            {isWatched ? <Favorite /> : <FavoriteBorder />}
          </button>
        )}
        {onClickRating && (
          <>
            <button
              onClick={() => onClickRating(product, RATING_TYPE.LIKE)}
              className={classNames(
                'border flex-center bg-white bg-opacity-50 hover:bg-opacity-100   absolute top-12 right-2 w-[36px] h-[36px] rounded-full inline-block duration-300 ease-linear transform-gpu'
              )}
            >
              <AiFillLike fill='#E4A834' size='20px' />
            </button>
            <button
              onClick={() => onClickRating(product, RATING_TYPE.DISLIKE)}
              className={classNames(
                'border flex-center bg-white bg-opacity-50 hover:bg-opacity-100  absolute top-[88px] right-2 w-[36px] h-[36px] rounded-full inline-block duration-300 ease-linear transform-gpu'
              )}
            >
              <AiFillDislike fill='#B13A1A' size='20px' />
            </button>
          </>
        )}
      </div>
      <div className='mt-4'>
        <h6 className=' leading-7 text-xl font-medium text-[#171d1c]'>
          <Link to={`/products/${product.id}`} className=' flex items-center'>
            {isHot && <img src={hotIcon} alt='' className='mr-1 w-5 h-5' />}
            {product.name}
          </Link>
        </h6>
        <p className=' text-xs mt-1'>
          Ngày đăng:{' '}
          <b className='font-medium'>
            {moment(product.createdAt).format('HH:mm DD-MM-YYYY')}
          </b>
        </p>
        <p className=' text-xs mt-1'>
          Người ra giá: <b className='font-medium'>{biderName}</b>
        </p>
        <div className='flex flex-wrap mt-4'>
          <div className='py-3 px-2.5 flex items-center border-t-2 border-b-2 border-dotted border-[#deddf5] w-1/2 justify-center relative before:block before:absolute before:w-[1px] before:right-0 before:bottom-[15px] before:top-[15px] before:bg-[#bfbee8]'>
            <div className=' max-w-[36px] leading-none'>
              <RiAuctionFill color='#43b055' size='36px' />
            </div>
            <div className='max-w-[calc(100% - 30px)] pl-[15px]'>
              <div className='leading-5 text-sm text-[#43b055] mb-[5px] '>
                Giá hiện tại
              </div>
              <div className='leading-5 text-lg text-[#171d1c]'>
                {currentPrice?.toCurrency?.()}
              </div>
            </div>
          </div>
          <div className=' py-3 px-2.5 flex items-center border-t-2 border-b-2 border-dotted border-[#deddf5] w-1/2 justify-center relative'>
            <div className=' max-w-[36px] leading-none'>
              <RiMoneyDollarCircleFill color='ee4730' size='36px' />
            </div>
            <div className='max-w-[calc(100% - 30px)] pl-[15px]'>
              <div className='leading-5 text-sm text-[#ee4730] mb-[5px] '>
                Giá mua ngay
              </div>
              <div className='leading-5 text-lg text-[#171d1c]'>
                {product.purchasePrice?.toCurrency?.()}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center mt-[5px] text-lg mb-5 mx-2.5'>
          <div className='product-countdown'>{countdownTime}</div>
          <div className='pl-[35px] mt-[5px] text-[#43b055] border-l-[1px] border-[#d0cff0] leading-5'>
            {product.totalBids} đấu giá
          </div>
        </div>
        <div className='text-center'>
          <Link
            to={`/products/${product.id}`}
            className=' shadow-primary-button bg-gradient-to-t from-[#3da9f5] to-[#683df5] capitalize w-full max-w-[230px] text-white rounded-[30px] font-medium pt-3 pb-2.5 px-[30px] text-lg'
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProducListItem
