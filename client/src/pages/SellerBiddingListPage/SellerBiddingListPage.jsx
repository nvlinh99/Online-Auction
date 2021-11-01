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
import { bidderApi, sellerApi, userAPI, watchListApi } from 'services'
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
const FILTER_OPTIONS = [
  {
    label: 'Tất cả',
    optionValue: 'all',
  },
  {
    label: 'Sản phẩm đã kểt thúc',
    optionValue: 'expired',
  },
  {
    label: 'Sản phẩm có người chiến thắng',
    optionValue: 'has-won',
  },
  {
    label: 'Sản phẩm đang diễn ra',
    optionValue: 'not-end',
  },
]
const SellerBiddingListPage = () => {
  const isTogglingWatchList = useSelector(selectIsTogglingWatchList)

  const [products, setProducts] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedInUser, isLoggingUser, currentUser } = useLogin()
  const { query, onChange } = useQuery()
  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const { succeeded, data } = await sellerApi.getBiddingProducts({
        ...pick(query, ['page', 'limit', 'filterType']),
      })
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setProducts(data)
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }, [query])
  useEffect(() => {
    loadData()
  }, [loadData])

  const onToggleWatchList = async (product) => {
    const { id: productId } = product || {}
    if (!isLoggedInUser()) {
      return
    }
    toggleWatchListFromApi({ productId }, () => loadData())
  }
  return (
    <div className='container mx-auto mt-[40px]'>
      <LdsLoading isFullscreen isLoading={isLoading} />
      <div className='flex-col md:flex-row shadow-pane mb-10 border border-[rgba(13, 21, 75, 0.15)] rounded-[5px] flex-between py-[5px] px-4'>
        <h1 className='text-2xl leading-10 font-semibold text-[#171d1c]'>
          Danh Sách sản phẩm đang đấu giá
        </h1>
        <div className='flex-center text-[#171d1c] text-base'>
          <span className='mr-3'>Lọc theo:</span>
          <Select
            className='min-w-[230px] my-4'
            value={query?.filterType || 'all'}
            onChange={(e) => onChange('filterType', e.target.value)}
          >
            {FILTER_OPTIONS.map((item, itemIndex) => {
              return (
                <MenuItem key={item.optionValue} value={item.optionValue}>
                  {item.label}
                </MenuItem>
              )
            })}
          </Select>
        </div>
      </div>
      <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-[35px] '>
        {products?.items?.map((product) => {
          return (
            <ProducListItem
              currentUser={currentUser}
              key={product.id}
              product={product}
              onToggleWatchList={onToggleWatchList}
              isTogglingWatchList={isTogglingWatchList}
            />
          )
        })}
      </div>
      <Pagination
        page={query?.page || 1}
        pageCount={products.totalPages}
        onChange={onChange}
        containerClassName='mb-[35px]'
      />
    </div>
  )
}

export default SellerBiddingListPage
