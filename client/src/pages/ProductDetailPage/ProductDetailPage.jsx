import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const params = useParams()
  return (
    <div>
      <h1>PRODUCT DETAIL PAGE: {params.productId}</h1>
    </div>
  )
}

export default ProductDetailPage
