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
import { selectCurrentUser } from 'store/user/selector'
import { watchListApi } from 'services'
import { toast } from 'react-toastify'
import { productAction } from 'store/product'
import LdsLoading from 'components/Loading/LdsLoading'
import { useLocation, useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from 'constants/routeConstants'

const ProductListPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [isTogglingWatchList, setIsTogglingWatchList] = useState(-1)
  const isGetProductsLoading = useSelector(selectGetProductsLoading)
  const { query, onChange } = useQuery()
  const products = useSelector(selectProducts)
  const [sortType, setSortType] = useState('default')
  useEffect(() => {
    const sort = parseSortType(sortType)
    query && getProductsFromAPI({ ...query, sort })
  }, [query, sortType])
  const onChangeSortType = (e) => {
    setSortType(e.target.value)
  }
  const onToggleWatchList = async (product) => {
    const { id: productId } = product || {}
    if (!currentUser?.id) {
      const loginPath = `${LOGIN_PATH}?retRef=${
        location.pathname + location.search
      }`
      return navigate(loginPath)
    }
    setIsTogglingWatchList(productId)
    try {
      const { succeeded, data } = await watchListApi.toggleWatchList({
        productId,
      })
      if (!succeeded) {
        return toast.error(data.message)
      }
      const newProduct = { ...product }
      newProduct.watchList = [...(newProduct.watchList || [])]
      if (data.added) {
        newProduct.watchList.push(currentUser.id)
      } else {
        newProduct.watchList = newProduct.watchList.filter(
          (id) => id !== currentUser.id
        )
      }
      productAction.updateProduct({ product: newProduct })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsTogglingWatchList(-1)
    }
    return true
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
          <SortSelect value={sortType} onChange={onChangeSortType} />
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

export default ProductListPage
