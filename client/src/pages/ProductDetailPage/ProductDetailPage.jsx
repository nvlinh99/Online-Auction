import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { productList } from 'pages/HomePage/dummy-data'
import { Container, Modal, Box } from '@mui/material'
import { formatProductItem } from 'utils/product-util'
import TimeLeft from 'components/TimeLeftDetail'
import BidAction from './BidAction'
import IconGavel from '@mui/icons-material/Gavel'
import IconFavorit from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SellerBiderInfo from './SellerBiderInfo'
import ImgListModal from './ImgListModal'
import ImageGallery from 'react-image-gallery'
import * as productApi from 'services/prodcutApi'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectIsTogglingWatchList,
} from 'store/user/selector'
import { getLoginUrl } from 'utils/helpers/urlHelper'
import LdsLoading from 'components/Loading/LdsLoading'
import ConfirmationModal from 'components/Modal/ConfirmationModal'
import useLogin from 'hooks/useLogin'
import { toggleWatchListFromApi } from 'store/user/action'
import classNames from 'classnames'

const ProductDetailPage = () => {
  const isTogglingWatchList = useSelector(selectIsTogglingWatchList)
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
  const { isLoggedInUser } = useLogin()
  const currentUser = useSelector(selectCurrentUser)
  const bidAction = useRef({})
  const params = useParams()
  const [isNotFound, setIsNotFound] = useState(false)
  const [product, setProduct] = useState(null)
  const imgListModal = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const openModal = () => {
    return imgListModal.current.openModal && imgListModal.current.openModal()
  }
  const onBid = useCallback(() => {
    setIsLoading(true)
    return bidAction.current?.onBid((succeeded) => {
      if (!succeeded) {
        setIsLoading(false)

        return
      }
      loadProductData()
    })
  }, [loadProductData])
  const onClickBid = useCallback(() => {
    if (!isLoggedInUser()) {
      return
    }
    setIsOpenConfirmationModal(true)
  }, [isLoggedInUser])
  const loadProductData = useCallback(async () => {
    try {
      const { succeeded, data } = await productApi.postProductById(
        params.productId
      )
      if (!succeeded || !data || !data.product || data.product.status !== 0)
        return setIsNotFound(true)
      return setProduct(data.product)
    } catch (err) {
      return setIsNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }, [params.productId])
  const onToggleWatchList = useCallback(async () => {
    const { id: productId } = product || {}
    if (!isLoggedInUser() || !productId) {
      return
    }
    toggleWatchListFromApi({ productId })
  }, [isLoggedInUser, product])
  useEffect(() => {
    loadProductData()
  }, [loadProductData])
  const isWatched = useMemo(() => {
    return currentUser?.watchList?.map((i) => i.productId).includes(product?.id)
  }, [currentUser, product])
  if (isNotFound)
    return (
      <Container className='mt-14'>
        <pproduct
          className='text-center'
          style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Sản phẩm bạn đang tìm kiếm không có trong hệ thống!
        </pproduct>
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
    const isTogglingWatchListProduct = isTogglingWatchList === id
    return (
      <>
        <LdsLoading isFullscreen isLoading={isLoading} />
        <ConfirmationModal
          open={isOpenConfirmationModal}
          onCancel={() => setIsOpenConfirmationModal(false)}
          onOK={() => {
            setIsOpenConfirmationModal(false)
            onBid()
          }}
          message='Bạn có chắc muốn đấu giá sản phẩm này'
          title='Xác nhận đấu giá'
        />

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
                <div className='mr-4'>
                  <p>{formatedStartPrice || '#'}</p>
                  <p>{formatedCurrentPrice || '#'}</p>
                </div>
                <div className='mr-8'>
                  <p>VND</p>
                  <p>VND</p>
                </div>
                {formatedPurchasePrice && (
                  <div className='p-4'>
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
                  ref={bidAction}
                  product={product}
                />
                <button
                  className='bid-btn ml-3 alt'
                  // title='Ra giá ngay'
                  type='button'
                  data-tooltip='RA GIÁ NGAY'
                  onClick={onClickBid}
                >
                  <IconGavel />
                </button>
                <button
                  type='button'
                  // title='Thêm vào danh sách yêu thích'
                  className={classNames(
                    'bid-action-add-watch-list-btn ml-3 alt ',
                    isWatched && 'border-red-400 text-red-400'
                  )}
                  data-tooltip='THÊM YÊU THÍCH'
                  onClick={onToggleWatchList}
                  disabled={isTogglingWatchList === product?.id}
                >
                  {isWatched ? (
                    <FavoriteIcon
                      fontSize='small'
                      className={isTogglingWatchListProduct && 'spin-animation'}
                    />
                  ) : (
                    <IconFavorit
                      fontSize='small'
                      className={isTogglingWatchListProduct && 'spin-animation'}
                    />
                  )}
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
