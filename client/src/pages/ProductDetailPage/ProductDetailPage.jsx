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
import ProducListItem from 'components/ProducListItem'
import { Button } from 'antd'
import ReactQuill from 'react-quill'

const ProductDetailPage = () => {
  const isTogglingWatchList = useSelector(selectIsTogglingWatchList)
  const { isLoggedInUser } = useLogin()
  const currentUser = useSelector(selectCurrentUser)
  const bidAction = useRef({})
  const params = useParams()
  const [editing, setEditing] = useState(false)
  const [editDescription, setEditDescription] = useState('')
  const [isNotFound, setIsNotFound] = useState(false)
  const [product, setProduct] = useState(null)
  const imgListModal = useRef({})
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false)
  const [isOpenPurchaseConfirmationModal, setIsOpenPurchaseConfirmationModal] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false)
  const [rejectBidId, setRejectBidId] = useState(-1)
  const [sameCateProductList, setSameCateProductList] = useState([])
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
        toast.success('T??? ch???i l?????t ra gi?? th??nh c??ng.')
        loadProductData()
      } else {
        toast.error(
          data && data.message ? data.message : 'T??? ch???i l?????t ra gi?? th???t b???i!!'
        )
      }
    } catch (err) {
      setIsLoading(false)
      toast.error('T??? ch???i l?????t ra gi?? th???t b???i!!')
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
  const onClickPurchase = useCallback(() => {
    if (!isLoggedInUser()) {
      return
    }
    setIsOpenPurchaseConfirmationModal(true)
  }, [isLoggedInUser])

  const onEditing = () => {
    setEditing(true)
  }

  const onUpdateDesc = async () => {
    try {
      const { succeeded, data } = await productApi.updateDecs(
        product.id,
        editDescription
      )
      if (!succeeded) {
        toast.error(data?.message || 'Th??m m?? t??? kh??ng th??nh c??ng!')
        loadProductData()
      } else {
        toast.success('Th??m m?? t??? th??nh c??ng!')
      }
    } catch (e) {
      toast.error('???? c?? l???i t??? h??? th???ng!')
    } finally {
      setEditDescription('')
      setEditing(false)
    }
  }

  const onPurchase = useCallback(async () => {
    if (!product || !product.purchasePrice) return
    setIsLoading(true)
    try {
      const { succeeded, data } = await productApi.bidProduct({
        productId: product.id,
        price: product.purchasePrice,
      })
      if (!succeeded) {
        toast.error(data.message || 'Y??u c???u mua s???n ph???m th???t b???i!')
      } else {
        toast.info('B???n l?? ng?????i chi???n th???ng ?????u gi??!!')
      }
    } catch (e) {
      toast.error('Y??u c???u mua s???n ph???m th???t b???i!')
    } finally {
      setIsLoading(false)
      loadProductData()
    }
  }, [product, loadProductData])
  const loadProductData = useCallback(async () => {
    setIsLoading(true)
    try {
      let { succeeded, data } = await productApi.postProductById(
        params.productId
      )
      if (!succeeded || !data || !data.product || data.product.status == 1)
        setIsNotFound(true)
      else {
        setProduct(data.product)
      }
    } catch (err) {
      setIsNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }, [params.productId])
  useEffect(() => {
    if (!product) return
    ;(async () => {
      const { succeeded, data } = await productApi.getProducts({
        categoryId: product.categoryId,
        exceptProductId: [product.id],
        page: 1,
        sort: {
          createdAt: -1,
        },
      })
      if (succeeded && data && data.items) {
        setSameCateProductList(data.items.slice(0, 5))
      }
    })()
  }, [product])
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
          S???n ph???m b???n ??ang t??m ki???m kh??ng c?? trong h??? th???ng!
        </pproduct>
      </Container>
    )

  if (product) {
    const {
      id,
      categoryId,
      categoryTitle,
      hasWinner,
      isExpired,
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
      purchasePrice,
      formatedExpiredDate,
      expiredDate,
      formatedPublishedDate,
      totalBid,
      hoursLeft: initHoursLeft,
      minutesLeft: initMinutesLeft,
      secondsLeft: initSecondsLeft,
      formatedTimeLeft,
      biderId,
      biderFirstname,
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
          message={`B???n c?? th???t s??? mu???n ra gi?? ${
            bidAction.current?.getPrice?.() || ''
          }?`}
          title='X??c nh???n ?????u gi??'
        />
        <ConfirmationModal
          open={isOpenPurchaseConfirmationModal}
          onCancel={() => setIsOpenPurchaseConfirmationModal(false)}
          onOK={() => {
            setIsOpenPurchaseConfirmationModal(false)
            onPurchase()
          }}
          message={`B???n c?? th???t s??? mu???n ra gi?? ${product.purchasePrice}?`}
          title='X??c nh???n ?????u gi??'
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
          message='B???n c?? th???t s??? mu???n t??? ch???i l?????t ?????u gi?? n??y?'
          title='X??c nh???n t??? ch???i l?????t ra gi??!'
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
              {hasWinner ? (
                <p className='product-detail-has-winner'>
                  S???n ph???m ???? c?? ng?????i th???ng ?????u gi??!!
                </p>
              ) : isExpired ? (
                <p className='product-detail-is-expired'>
                  S???n ph???m ???? k???t th??c th???i gian ?????u gi??!!
                </p>
              ) : (
                <>
                  <div className='product-prices flex items-center'>
                    <div className='mr-8'>
                      <p>Gi?? kh???i ??i???m:</p>
                      <p>Gi?? hi???n t???i:</p>
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
                        <button
                          className='btn-buy-now'
                          type='button'
                          onClick={onClickPurchase}
                        >
                          MUA NGAY V???I GI?? {formatedPurchasePrice} VND
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='product-time-left'>
                    <p className='mb-2'>Th???i gian c??n l???i:</p>
                    <TimeLeft
                      date={expiredDate}
                      initHoursLeft={initHoursLeft}
                      initMinutesLeft={initMinutesLeft}
                      initSecondsLeft={initSecondsLeft}
                    />
                    <div className='flex mt-6 mb-8'>
                      <div className='mr-6'>
                        <p className='mb-2'>K???t th??c ?????u gi?? v??o:</p>
                        <p className=''>S???n ph???m ????ng v??o l??c:</p>
                      </div>
                      <div>
                        <p className='mb-2'>{formatedExpiredDate}</p>
                        <p className=''>{formatedPublishedDate}</p>
                      </div>
                    </div>
                  </div>
                  <p className='mb-1'>Nh???p s??? ti???n mu???n ra gi?? (VND):</p>

                  <div style={{ position: 'relative' }} className='flex mb-8'>
                    <BidAction
                      initBidPrice={currentPrice + stepPrice}
                      stepPrice={stepPrice}
                      purchasePrice={purchasePrice}
                      ref={bidAction}
                      product={product}
                    />
                    <button
                      className='bid-btn ml-3 alt'
                      // title='Ra gi?? ngay'
                      type='button'
                      data-tooltip='RA GI?? NGAY'
                      onClick={onClickBid}
                    >
                      <IconGavel />
                    </button>
                    <button
                      type='button'
                      // title='Th??m v??o danh s??ch y??u th??ch'
                      className={classNames(
                        'bid-action-add-watch-list-btn ml-3 alt ',
                        isWatched && 'border-red-400 text-red-400'
                      )}
                      data-tooltip={
                        isWatched ? 'B??? Y??U TH??CH' : 'TH??M Y??U TH??CH'
                      }
                      onClick={onToggleWatchList}
                      disabled={isTogglingWatchList === product?.id}
                    >
                      {isWatched ? (
                        <FavoriteIcon
                          fontSize='small'
                          className={
                            isTogglingWatchListProduct && 'spin-animation'
                          }
                        />
                      ) : (
                        <IconFavorit
                          fontSize='small'
                          className={
                            isTogglingWatchListProduct && 'spin-animation'
                          }
                        />
                      )}
                    </button>
                  </div>

                  <SellerBiderInfo
                    className='mb-4'
                    title='Th??ng tin <strong>ng?????i b??n</strong> :'
                    name={sellerName}
                    rateTotal={sellerRateTotal}
                    rateIncrease={sellerRateIncrease}
                    rateDecrease={sellerRateDecrease}
                  />
                  {biderId && (
                    <SellerBiderInfo
                      title='Th??ng tin <strong>ng?????i ra gi??</strong> cao nh???t hi???n t???i :'
                      name={`****${biderFirstname}`}
                      rateTotal={biderRateTotal}
                      rateIncrease={biderRateIncrease}
                      rateDecrease={biderRateDecrease}
                    />
                  )}
                </>
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
                M?? t??? s???n ph???m
              </p>
              <div style={{ borderRight: '1px solid #ddd', height: '100%' }}>
                {currentUser?.role === 1 && currentUser?.id === sellerId && (
                  <div className='flex justify-center py-4 mb-4 border-b'>
                    {!editing ? (
                      <Button onClick={onEditing} type='primary'>
                        Th??m m?? t???
                      </Button>
                    ) : (
                      <Button onClick={onUpdateDesc} type='primary'>
                        Th??m
                      </Button>
                    )}
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: description }} />
                {editing && (
                  <ReactQuill
                    value={editDescription}
                    onChange={setEditDescription}
                    theme='snow'
                    className='mt-4'
                    style={{
                      width: '100%',
                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 5px',
                    }}
                  />
                )}
              </div>
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
                L???ch s??? ?????u gi??
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!!bidHistory && !!bidHistory.length ? (
                  <table id='bidHistTable' style={{ margin: '20px auto' }}>
                    <thead>
                      <tr>
                        <th className='bid-hist-cell'>Th???i gian</th>
                        <th className='bid-hist-cell'>Ng?????i ra gi??</th>
                        <th className='bid-hist-cell'>S??? ti???n</th>
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
                                ???? t??? ch???i
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
                                  T??? ch???i
                                </button>
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : currentUser && currentUser.id ? (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    Ch??a c?? l?????t ra gi?? n??o!
                  </p>
                ) : (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    Vui l??ng ????ng nh???p ????? xem l???ch s??? ?????u gi??!
                  </p>
                )}
              </div>
            </div>
          </div>
          <ImgListModal
            pRef={imgListModal}
            imgUrlList={[avatarUrl, ...imageUrls]}
          />
          <p
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              borderBottom: '1px solid #ddd',
              borderTop: '1px solid #ddd',
            }}
            className='mt-14 mb-4'
          >
            S???n ph???m c??ng danh m???c
          </p>
          <div className='grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-[35px] '>
            {sameCateProductList?.map((product) => {
              return (
                <ProducListItem
                  currentUser={currentUser}
                  key={product.id}
                  product={product}
                  onToggleWatchList={() => {}}
                  isTogglingWatchList={null}
                  noWatchList={true}
                />
              )
            })}
          </div>
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
