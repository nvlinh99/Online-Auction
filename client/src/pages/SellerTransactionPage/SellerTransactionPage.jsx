import Pagination from 'components/Pagination'
import ProducListItem from 'components/ProducListItem'
import SortSelect from 'components/SortSelect'
import useQuery from 'hooks/useQuery'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getProductsFromAPI } from 'store/product/action'
import {
  selectGetProductsLoading,
  selectProducts,
} from 'store/product/selector'
import { parseSortType } from 'utils/helpers/jsHelper'
import {
  selectCurrentUser,
  selectIsTogglingWatchList,
} from 'store/user/selector'
import {
  bidderApi,
  ratingApi,
  sellerApi,
  userAPI,
  watchListApi,
} from 'services'
import * as transactionApi from 'services/transactionApi'
import { toast } from 'react-toastify'
import { productAction } from 'store/product'
import LdsLoading from 'components/Loading/LdsLoading'
import { useLocation, useNavigate } from 'react-router-dom'
import { pick } from 'lodash'
import { getLoginUrl } from 'utils/helpers/urlHelper'
import useLogin from 'hooks/useLogin'
import { toggleWatchListFromApi } from 'store/user/action'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import ConfirmationModal from 'components/Modal/ConfirmationModal'
import { TextField } from '@mui/material'
import { RATING_TYPE } from 'constants/enumConstants'
import moment from 'moment'

const SellerWonProductsPage = () => {
  const [isOpenCompleteModal, setIsOpenCompleteModal] = useState(false)
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false)
  const [selectedTranId, setSelectedTranId] = useState(-1)
  const [trans, setTrans] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedInUser, isLoggingUser, currentUser } = useLogin()
  const { query, onChange } = useQuery()
  const onComplete = useCallback(async () => {
    setIsLoading(true)
    try {
      const { succeeded, data } = await transactionApi.updateTransaction(
        selectedTranId,
        1
      )
      if (!succeeded) {
        toast.error(data?.message || 'Thao tác thất bại!')
      }
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setSelectedTranId(-1)
      setIsLoading(false)
      setIsOpenCompleteModal(false)
      loadData()
    }
  }, [selectedTranId, loadData])
  const onCancel = useCallback(async () => {
    setIsLoading(true)
    try {
      const { succeeded, data } = await transactionApi.updateTransaction(
        selectedTranId,
        2
      )
      if (!succeeded) {
        toast.error(data?.message || 'Thao tác thất bại!')
      }
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setSelectedTranId(-1)
      setIsLoading(false)
      setIsOpenCancelModal(false)
      loadData()
    }
  }, [selectedTranId, loadData])
  const loadData = useCallback(async () => {
    if (!isLoggedInUser()) return null
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const { succeeded, data } = await transactionApi.getTransactions(
        query?.page || 1
      )
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setTrans(data)
      // eslint-disable-next-line no-empty
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedInUser, query])
  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className='container mx-auto mt-[40px]'>
      <ConfirmationModal
        open={isOpenCompleteModal}
        onCancel={() => {
          setSelectedTranId(-1)
          setIsOpenCompleteModal(false)
        }}
        onOK={onComplete}
        message={<p>Bạn có chắn muốn hoàn thành giao dịch?</p>}
        title='Xác nhận hoàn thành.'
      />
      <ConfirmationModal
        open={isOpenCancelModal}
        onCancel={() => {
          setSelectedTranId(-1)
          setIsOpenCancelModal(false)
        }}
        onOK={onCancel}
        message={<p>Bạn có chắn muốn hủy giao dịch?</p>}
        title='Xác nhận hủy.'
      />
      <LdsLoading isFullscreen isLoading={isLoading} />
      <div className='flex-col md:flex-row shadow-pane mb-10 border border-[rgba(13, 21, 75, 0.15)] rounded-[5px] flex-between py-[5px]  py-[30px] px-4'>
        <h1 className='text-2xl leading-10 font-semibold text-[#171d1c]'>
          Danh sách giao dịch
        </h1>
      </div>
      <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-[35px] '>
        {trans?.items?.map((tran, idx) => {
          return (
            <div
              style={{
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.35) 5px 5px 10px',
                padding: '10px',
              }}
              key={tran.id}
            >
              <p style={{ fontWeight: 'bold', fontSize: '22px' }}>
                Sản phẩm: {tran?.product?.name}
              </p>
              <p>
                Người mua:{' '}
                <strong>{`${tran?.winner?.firstName} ${tran?.winner?.lastName}`}</strong>
              </p>
              <p>
                Thời gian: {moment(tran?.createdAt).format('hh:mm DD-MM-YYYY')}
              </p>
              <p>
                Trạng thái:{' '}
                <span style={getTranStatusStyle(tran)}>
                  {getTranStatus(tran)}
                </span>
              </p>
              <div className='mt-2'>
                {tran?.status === 0 && (
                  <>
                    <button
                      className='mr-4 p-2'
                      type='button'
                      onClick={() => {
                        setSelectedTranId(tran.id)
                        setIsOpenCompleteModal(true)
                      }}
                      style={{
                        borderRadius: '5px',
                        color: '#fff',
                        display: 'inline-block',
                        background: '#00c853',
                      }}
                    >
                      Hoàn thành
                    </button>
                    <button
                      className='p-2'
                      type='button'
                      onClick={() => {
                        setSelectedTranId(tran.id)
                        setIsOpenCancelModal(true)
                      }}
                      style={{
                        width: '100px',
                        borderRadius: '5px',
                        color: '#fff',
                        display: 'inline-block',
                        background: '#d50000',
                      }}
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Pagination
        page={query?.page || 1}
        pageCount={trans.totalPages}
        onChange={onChange}
        containerClassName='mb-[35px]'
      />
    </div>
  )
}

function getTranStatus(tran) {
  if (tran.status === 0) return 'Đang chờ'
  if (tran.status === 1) return 'Đã hoàn thành'
  if (tran.status === 2) return 'Đã hủy'
  return ''
}

function getTranStatusStyle(tran) {
  const style = { fontWeight: 'bold', fontSize: '16px' }
  if (tran.status === 0) style.color = '#ffc400'
  if (tran.status === 1) style.color = '#00c853'
  if (tran.status === 2) style.color = '#d50000'
  return style
}
export default SellerWonProductsPage
