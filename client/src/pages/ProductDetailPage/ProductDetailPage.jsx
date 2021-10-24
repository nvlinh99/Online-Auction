import _ from 'lodash'
import moment from 'moment'
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
import IconClear from '@mui/icons-material/Clear'
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
import { toast } from 'react-toastify'
import * as socketService from 'services/socket-service'

const ProductDetailPage = () => {
  const isTogglingWatchList = useSelector(selectIsTogglingWatchList)
  const { isLoggedInUser } = useLogin()
  const currentUser = useSelector(selectCurrentUser)
  const bidAction = useRef({})
  const params = useParams()
  const [isNotFound, setIsNotFound] = useState(false)
  const [product, setProduct] = useState(null)
  const imgListModal = useRef({})
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false)
  const [rejectBidId, setRejectBidId] = useState(-1)
  const openModal = () => {
    return imgListModal.current.openModal && imgListModal.current.openModal()
  }
  const onRejectBid = useCallback((e) => {
    const bidId = +e.target.getAttribute('bid-id')
    setRejectBidId(bidId)
    setIsOpenRejectModal(true)
  }, [])
  const onReject = useCallback(async () => {
    setIsLoading(true)
    try {
      const { succeeded, data } = await productApi.rejectBid(rejectBidId)
      setIsLoading(false)
      if (succeeded) {
        toast.success('Từ chối lượt ra giá thành công.')
        loadProductData()
      } else {
        toast.error(
          data && data.message ? data.message : 'Từ chối lượt ra giá thất bại!!'
        )
      }
    } catch (err) {
      setIsLoading(false)
      toast.error('Từ chối lượt ra giá thất bại!!')
    } finally {
      setRejectBidId(-1)
    }
  }, [loadProductData, rejectBidId])
  const onBid = useCallback(() => {
    setIsLoading(true)
    return bidAction.current?.onBid((succeeded) => {
      if (!succeeded) {
        setIsLoading(false)

        return
      }
      setIsLoading(false)
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
    setIsLoading(true)
    try {
      const { succeeded, data } = await productApi.postProductById(
        params.productId
      )
      if (!succeeded || !data || !data.product || data.product.status !== 0)
        setIsNotFound(true)
      else setProduct(data.product)
    } catch (err) {
      setIsNotFound(true)
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
  useEffect(() => {
    const socket = socketService.subProductChange({
      productId: params.productId,
      cb: (data) => {
        setProduct((old) => {
          const newData = {
            ...old,
            ...data.product,
          }
          const newBid = data.product.newBid
          if (newBid) {
            if (currentUser?.id && product?.sellerId === currentUser?.id) {
              newBid.displayBiderName = `${data.product?.biderInfo?.lastName} ${data.product?.biderInfo?.firstName}`
            } else {
              newBid.displayBiderName = `****${data.product?.biderInfo?.firstName}`
            }
            const bidHistory = [newBid, ...old.bidHistory]
            newData.bidHistory = bidHistory
          }
          if (data.product.bidHistory) {
            if (!currentUser?.id || product?.sellerId !== currentUser?.id) {
              newData.bidHistory = data.product.bidHistory
            }
          }
          return newData
        })
      },
    })

    return socket.disconnect
  }, [currentUser?.id, params.productId, product?.sellerId])
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
      description,
      bidHistory,
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
          message={`Bạn có thật sự muốn ra giá ${
            bidAction.current?.getPrice?.() || ''
          }?`}
          title='Xác nhận đấu giá'
        />
        <ConfirmationModal
          open={isOpenRejectModal}
          onCancel={() => {
            setRejectBidId(-1)
            setIsOpenRejectModal(false)
          }}
          onOK={() => {
            setIsOpenRejectModal(false)
            onReject()
          }}
          message='Bạn có thật sự muốn từ chối lượt đấu giá này?'
          title='Xác nhận từ chối lượt ra giá!'
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
                  data-tooltip={isWatched ? 'BỎ YÊU THÍCH' : 'THÊM YÊU THÍCH'}
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
          <div style={{ marginTop: '20px' }} className='flex'>
            <div style={{ flex: 2 }}>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  textAlign: 'center',
                  borderTop: '1px solid #ddd',
                  borderBottom: '1px solid #ddd',
                }}
              >
                Mô tả sản phẩm
              </p>
              <div
                style={{ borderRight: '1px solid #ddd', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: description }}
              ></div>
            </div>
            <div style={{ flex: 3 }}>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  textAlign: 'center',
                  borderTop: '1px solid #ddd',
                  borderBottom: '1px solid #ddd',
                }}
              >
                Lịch sử đấu giá
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!!bidHistory && !!bidHistory.length ? (
                  <table id='bidHistTable' style={{ margin: '20px auto' }}>
                    <thead>
                      <tr>
                        <th className='bid-hist-cell'>Thời gian</th>
                        <th className='bid-hist-cell'>Người ra giá</th>
                        <th className='bid-hist-cell'>Số tiền</th>
                        {currentUser?.role === 1 &&
                          currentUser?.id === sellerId && (
                            <th className='bid-hist-cell'></th>
                          )}
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.map((his) => (
                        <tr key={his.id}>
                          <td
                            style={getCellStyle(his)}
                            className='bid-hist-cell'
                          >
                            {moment(his.createdAt).format(
                              'DD/MM/YYYY hh:mm:ss'
                            )}
                          </td>
                          <td
                            style={getCellStyle(his)}
                            className='bid-hist-cell'
                          >
                            {his.displayBiderName}
                          </td>
                          <td
                            style={getCellStyle(his)}
                            className='bid-hist-cell'
                          >
                            {numeral(his.price).format('0,0')}
                          </td>
                          {currentUser?.role === 1 &&
                            currentUser?.id === sellerId &&
                            (his.status === 1 ? (
                              <td
                                style={{
                                  ...getCellStyle(his),
                                  textDecoration: 'none',
                                }}
                                className='bid-hist-cell'
                              >
                                Đã từ chối
                              </td>
                            ) : (
                              <td className='bid-hist-cell'>
                                <button
                                  onClick={onRejectBid}
                                  bid-id={his.id}
                                  style={{
                                    color: '#fff',
                                    padding: '5px',
                                    borderRadius: '5px',
                                    background: '#ff5252',
                                  }}
                                  type='button'
                                >
                                  <IconClear />
                                  Từ chối
                                </button>
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : currentUser && currentUser.id ? (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    Chưa có lượt ra giá nào!
                  </p>
                ) : (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    Vui lòng đăng nhập để xem lịch sử đấu giá!
                  </p>
                )}
              </div>
            </div>
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

function getCellStyle(his) {
  return his.status === 1
    ? {
        fontStyle: 'italic',
        textDecoration: 'line-through',
        color: '#ff5252',
      }
    : {}
}

export default ProductDetailPage
