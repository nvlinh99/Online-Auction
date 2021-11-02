import Pagination from 'components/Pagination'
import ProducListItem from 'components/ProducListItem'
import SortSelect from 'components/SortSelect'
import useQuery from 'hooks/useQuery'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { parseSortType } from 'utils/helpers/jsHelper'
import { selectCurrentUser } from 'store/user/selector'
import LdsLoading from 'components/Loading/LdsLoading'
import { pick } from 'lodash'
import useLogin from 'hooks/useLogin'
import { adminApi, productAPI } from 'services'
import { toast } from 'react-toastify'
import ConfirmationModal from 'components/Modal/ConfirmationModal'

const AdminProductListPage = () => {
  const [isDeleting, setIsDeleting] = useState({
    isOpenModal: false,
    product: {},
  })

  const currentUser = useSelector(selectCurrentUser)
  const { isLoggedInUser } = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState({})

  const { query, onChange } = useQuery()
  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const sort = parseSortType(query?.sortType || 'default')
      const { succeeded, data } = await productAPI.getProducts({
        ...pick(query, ['page']),
        sort,
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

  const onChangeSortType = (e) => {
    onChange('sortType', e.target.value || 'default')
  }
  const onDelete = async () => {
    try {
      setIsLoading(true)
      let body = { ...isDeleting.product }
      const { succeeded, data } = await adminApi.productAPI.deleteProduct(body)
      if (!succeeded) {
        setIsLoading(false)
        toast.error(data?.message)

        return
      }
      loadData()
      toast.success(data?.message)
    } catch (error) {
      setIsLoading(false)
      toast.error(error?.message)
    } finally {
      setIsDeleting({ isOpenModal: false, product: {} })
    }
  }
  const handleDelete = (product) => {
    setIsDeleting({
      isOpenModal: true,
      product,
    })
  }
  return (
    <div className='container mx-auto mt-[40px]'>
      <ConfirmationModal
        open={isDeleting.isOpenModal}
        onCancel={() => {
          setIsDeleting({ isOpenModal: false, product: {} })
        }}
        onOK={() => {
          onDelete()
        }}
        message='Bạn có thật sự muốn xóa sản phẩm này?'
        title='Xác nhận xóa sản phẩm!'
      />
      <LdsLoading isFullscreen isLoading={isLoading} />
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
              noWatchList
              currentUser={currentUser}
              key={product.id}
              product={product}
              onClickCategory={() =>
                onChange('categoryId', product?.categoryInfo?.id || '')
              }
              onDelete={handleDelete}
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

export default AdminProductListPage
