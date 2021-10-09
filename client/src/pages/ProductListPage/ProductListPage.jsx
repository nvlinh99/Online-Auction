import useQuery from 'hooks/useQuery'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { productAction } from 'store/product'
import { getProductsFromAPI } from 'store/product/action'
import { selectProducts } from 'store/product/selector'

const ProductListPage = () => {
  const { query, onChange } = useQuery()
  const products = useSelector(selectProducts)
  useEffect(() => {
    getProductsFromAPI()
  }, [query])
  return (
    <div>
      <button onClick={() => onChange('xz', 1)}>xx</button>
    </div>
  )
}

export default ProductListPage
