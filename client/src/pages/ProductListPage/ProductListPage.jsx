import ProducListItem from 'components/ProducListItem'
import useQuery from 'hooks/useQuery'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getProductsFromAPI } from 'store/product/action'
import { selectProducts } from 'store/product/selector'

const ProductListPage = () => {
  const { query, onChange } = useQuery()
  const products = useSelector(selectProducts)
  useEffect(() => {
    getProductsFromAPI(query)
  }, [query])
  return (
    <div className='container mx-auto'>
      <h1>Danh sach san pham</h1>
      <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'>
        {products?.items?.map((product) => {
          return <ProducListItem key={product.id} product={product} />
        })}
      </div>
    </div>
  )
}

export default ProductListPage
