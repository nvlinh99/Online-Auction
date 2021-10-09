import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productList } from 'pages/HomePage/dummy-data'
import { Container, Modal, Box } from '@mui/material'
import { formatProductItem } from 'utils/product-util'
import TimeLeft from 'components/TimeLeftDetail'
import BidAction from './BidAction'
import IconGavel from '@mui/icons-material/Gavel'
import IconFavorit from '@mui/icons-material/FavoriteBorder'
import SellerBiderInfo from './SellerBiderInfo'
import ImgListModal from './ImgListModal'
import ImageGallery from 'react-image-gallery'

const ProductDetailPage = () => {
  const params = useParams()
  const [isNotFound, setIsNotFound] = useState(false)
  const [product, setProduct] = useState(null)
  const imgListModal = useRef({})
  const openModal = () => {
    return imgListModal.current.openModal && imgListModal.current.openModal()
  }

  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      const product = _.find(productList, (pr) => pr.id === +params.productId)
      if (!product) return setIsNotFound(true)
      setProduct(product)
    },
    [params.productId]
  )

  if (isNotFound)
    return (
      <Container className='mt-14'>
        <p
          className='text-center'
          style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Sản phẩm bạn đang tìm kiếm không có trong hệ thống!
        </p>
      </Container>
    )
  if (product) {
    const {
      id,
      categoryId,
      categoryTitle,
      title,
      avatarUrl,
      imageUrls,
      formatedStartPrice,
      formatedCurrentPrice,
      formatedPurchasePrice,
      currentPrice,
      stepPrice,
      formatedExpiredDate,
      formatedPublishedDate,
      totalBid,
      hoursLeft: initHoursLeft,
      minutesLeft: initMinutesLeft,
      secondsLeft: initSecondsLeft,
      formatedTimeLeft,
      biderId,
      biderName,
      biderRateTotal,
      biderRateIncrease,
      biderRateDecrease,
      sellerId,
      sellerName,
      sellerRateTotal,
      sellerRateIncrease,
      sellerRateDecrease,
    } = formatProductItem(product)
    const formatedInitPrice = numeral(currentPrice + stepPrice).format('0,0')
    const imageSlides = [avatarUrl, ...imageUrls].map((url) => {
      return {
        original: url,
        thumbnail: url,
        loading: 'lazy',
      }
    })
    console.log(avatarUrl)
    return (
      <>
        <Container className='mt-14'>
          <div className='product-detail-head-info'>
            <p className='product-detail-head-title'>{title}</p>
          </div>

          <div className='product-detail-key-info flex'>
            <div className='product-detail-key-info-left'>
              <ImageGallery
                useBrowserFullscreen={false}
                showPlayButton={false}
                showIndex={false}
                items={imageSlides}
              />
            </div>
            <div className='product-detail-key-info-right'>
              <div className='product-prices flex items-center'>
                <div className='mr-8'>
                  <p>Giá khởi điểm:</p>
                  <p>Giá hiện tại:</p>
                </div>
                <div className='mr-8'>
                  <p>{formatedStartPrice || '#'}</p>
                  <p>{formatedCurrentPrice || 'Chưa có lượt đấu giá nào'}</p>
                </div>
                <div className='mr-8'>
                  <p>VND</p>
                  <p>VND</p>
                </div>
                {formatedPurchasePrice && (
                  <div>
                    <button className='btn-buy-now' type='button'>
                      MUA NGAY VỚI GIÁ {formatedPurchasePrice} VND
                    </button>
                  </div>
                )}
              </div>
              <div className='product-time-left'>
                <p className='mb-2'>Thời gian còn lại:</p>
                <TimeLeft
                  initHoursLeft={initHoursLeft}
                  initMinutesLeft={initMinutesLeft}
                  initSecondsLeft={initSecondsLeft}
                />
                <div className='flex mt-6 mb-8'>
                  <div className='mr-6'>
                    <p className='mb-2'>Kết thúc đấu giá vào:</p>
                    <p className=''>Sản phẩm đăng vào lúc:</p>
                  </div>
                  <div>
                    <p className='mb-2'>{formatedExpiredDate}</p>
                    <p className=''>{formatedPublishedDate}</p>
                  </div>
                </div>
              </div>
              <p className='mb-1'>Nhập số tiền muốn ra giá (VND):</p>

              <div style={{ position: 'relative' }} className='flex mb-8'>
                <BidAction
                  initBidPrice={currentPrice + stepPrice}
                  stepPrice={stepPrice}
                />
                <button
                  className='bid-btn ml-3 alt'
                  // title='Ra giá ngay'
                  type='button'
                  data-tooltip='RA GIÁ NGAY'
                >
                  <IconGavel />
                </button>
                <button
                  type='button'
                  // title='Thêm vào danh sách yêu thích'
                  className='bid-action-add-watch-list-btn ml-3 alt'
                  data-tooltip='THÊM YÊU THÍCH'
                >
                  <IconFavorit fontSize='small' />
                </button>
              </div>

              <SellerBiderInfo
                className='mb-4'
                title='Thông tin <strong>người bán</strong> :'
                name={sellerName}
                rateTotal={sellerRateTotal}
                rateIncrease={sellerRateIncrease}
                rateDecrease={sellerRateDecrease}
              />
              {biderId && (
                <SellerBiderInfo
                  title='Thông tin <strong>người ra giá</strong> cao nhất hiện tại :'
                  name={biderName}
                  rateTotal={biderRateTotal}
                  rateIncrease={biderRateIncrease}
                  rateDecrease={biderRateDecrease}
                />
              )}
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <p>Phần dưới ....</p>
          </div>
          <ImgListModal
            pRef={imgListModal}
            imgUrlList={[avatarUrl, ...imageUrls]}
          />
        </Container>
      </>
    )
  }

  return <Container className='mt-14'></Container>
}

export default ProductDetailPage
