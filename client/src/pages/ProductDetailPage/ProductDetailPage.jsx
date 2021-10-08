import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productList } from 'pages/HomePage/dummy-data'
import { Container } from '@mui/material'
import { formatProductItem } from 'components/ProductListSlider/util'
import TimeLeft from 'components/TimeLeftDetail'

const ProductDetailPage = () => {
  const params = useParams()
  const [isNotFound, setIsNotFound] = useState(false)
  const [product, setProduct] = useState(null)
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
      formatedExpiredDate,
      formatedPublishedDate,
      totalBid,
      hoursLeft: initHoursLeft,
      minutesLeft: initMinutesLeft,
      secondsLeft: initSecondsLeft,
      formatedTimeLeft,
      biderName,
    } = formatProductItem(product)

    return (
      <Container className='mt-14'>
        <div className='product-detail-head-info'>
          <p className='product-detail-head-title'>{title}</p>
        </div>
        <div className='product-detail-key-info flex'>
          <div className='product-detail-key-info-left'>
            <div className='product-avatar-contaier'>
              <img src={avatarUrl} />
            </div>
            <div className='product-img-list-contaier flex '>
              {imageUrls?.map((imgUrl) => (
                <div key={imgUrl} className='product-img-container'>
                  <img src={imgUrl} />
                </div>
              ))}
            </div>
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
              <p className='mb-4'>Thời gian còn lại:</p>
              <TimeLeft
                initHoursLeft={initHoursLeft}
                initMinutesLeft={initMinutesLeft}
                initSecondsLeft={initSecondsLeft}
              />
              <p className='mt-4'>
                Tức kết thúc vào: &nbsp;&nbsp;{formatedExpiredDate}
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <p>Phần dưới ....</p>
        </div>
        /
      </Container>
    )
  }

  return <Container className='mt-14'></Container>
}

export default ProductDetailPage
