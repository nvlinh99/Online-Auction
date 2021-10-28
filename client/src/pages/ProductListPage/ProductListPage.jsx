import Pagination from 'components/Pagination'
import ProducListItem from 'components/ProducListItem'
import SortSelect from 'components/SortSelect'
import useQuery from 'hooks/useQuery'
import React, { useEffect, useState } from 'react'
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
import { watchListApi } from 'services'
import { toast } from 'react-toastify'
import { productAction } from 'store/product'
import LdsLoading from 'components/Loading/LdsLoading'
import { useLocation, useNavigate } from 'react-router-dom'
import { pick } from 'lodash'
import { getLoginUrl } from 'utils/helpers/urlHelper'
import useLogin from 'hooks/useLogin'
import { toggleWatchListFromApi } from 'store/user/action'

const ProductListPage = () => {
  const isTogglingWatchList = useSelector(selectIsTogglingWatchList)

  const currentUser = useSelector(selectCurrentUser)
  const { isLoggedInUser } = useLogin()
  const isGetProductsLoading = useSelector(selectGetProductsLoading)
  const { query, onChange } = useQuery()
  const products = useSelector(selectProducts)
  useEffect(() => {
    const sort = parseSortType(query?.sortType || 'default')
    query &&
      getProductsFromAPI({
        ...pick(query, ['text', 'categoryId', 'page']),
        sort,
      })
  }, [query])
  const onChangeSortType = (e) => {
    onChange('sortType', e.target.value || 'default')
  }
  const onToggleWatchList = async (product) => {
    const { id: productId } = product || {}
    if (!isLoggedInUser()) {
      return
    }
    toggleWatchListFromApi({ productId })
  }
  return (
    <div className='container mx-auto mt-[40px]'>
      <LdsLoading isFullscreen isLoading={isGetProductsLoading} />
      <div className='flex-col md:flex-row shadow-pane mb-10 border border-[rgba(13, 21, 75, 0.15)] rounded-[5px] flex-between py-[5px] px-4'>
        <h1 className='text-2xl leading-10 font-semibold text-[#171d1c]'>
          Danh Sách sản phẩm
        </h1>
        <div className='flex-center text-[#171d1c] text-base'>
          <span className='mr-3'>Sắp xếp theo:</span>
          <SortSelect
            value={query?.sortType || 'default'}
            onChange={onChangeSortType}
          />
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
              onClickCategory={() =>
                onChange('categoryId', product?.categoryInfo?.id || '')
              }
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

export default ProductListPage
