import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import ArrowR from '@mui/icons-material/ArrowForwardIosSharp'
import ArrowL from '@mui/icons-material/ArrowBackIosSharp'
import { formatProductList, formatProductItem } from './util'
import './index.css'

const ProductItem = ({ product, formated }) => {
  product = formated ? product : formatProductItem(product)
  const {
    id,
    title,
    avatarUrl,
    formatedCurrentPrice,
    formatedPurchasePrice,
    formatedPublishedDate,
    totalBid,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    formatedTimeLeft,
  } = product
  return (
    <Link to={`products/${product.id}`} className='product-item-container'>
      <div className='product-item-img-container'>
        {!!avatarUrl && <img className='product-item-img' src={avatarUrl} />}
      </div>
      <p className='product-item-title'>{!!title && title}</p>
      <div className='product-item-price-ctn'>
        <div className='product-item-info-line'>
          <p>Giá hiện tại:</p>
          <p className='product-item-curr-price'>
            {!!formatedCurrentPrice && <span>{formatedCurrentPrice} </span>}
            <span>&#8363;</span>
          </p>
        </div>
        <div className='product-item-info-line'>
          <p>Giá bán ngay:</p>
          <p className='product-item-purchase-price'>
            {!!formatedPurchasePrice && <span>{formatedPurchasePrice} </span>}
            <span>&#8363;</span>
          </p>
        </div>
      </div>
      <div className='product-item-info-line'>
        <p>Đăng lúc:</p>
        <p className='product-item-published-date'>
          {!!formatedPublishedDate && formatedPublishedDate}
        </p>
      </div>
      <div className='product-item-info-line'>
        <p>Tổng lượt ra giá:</p>
        <p>
          <strong>{!!totalBid && totalBid}</strong> lượt
        </p>
      </div>
      <div className='product-item-info-line'>
        <p>Thời gian còn lại:</p>
        <p>
          {hoursLeft > 0 ? (
            <span>
              {hoursLeft} <strong>giờ </strong>
            </span>
          ) : (
            ''
          )}
          {minutesLeft > 0 ? (
            <span>
              {minutesLeft} <strong>phút </strong>
            </span>
          ) : (
            ''
          )}
          {secondsLeft > 0 ? (
            <span>
              {secondsLeft} <strong>giây</strong>
            </span>
          ) : (
            ''
          )}
        </p>
      </div>
    </Link>
  )
}

const ProductList = ({ productList, formated }) => {
  productList = formated ? productList : formatProductList(productList)
  console.log(productList)
  return (
    <div className='product-list-container'>
      {productList &&
        productList.map((item) => (
          <ProductItem key={item.id} product={item} formated={true} />
        ))}
    </div>
  )
}

export { ProductItem }
export default ProductList
