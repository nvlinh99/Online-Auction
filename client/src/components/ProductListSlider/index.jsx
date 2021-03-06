import React, { useState } from 'react'
import Slider from 'react-slick'
import { formatProductList, formatProductItem } from 'utils/product-util'
import './index.css'
import { ProductItem } from 'components/ProductList'

const sliderSettings = {
  // dots: true,
  infinite: false,
  speed: 400,
  // centerMode: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  // autoplay: true,
}

export default function ProductListSlider({
  currentUser,
  productList,
  formated,
  watchList,
  onToggleWatchList,
  isTogglingWatchList,
}) {
  productList = formated ? productList : formatProductList(productList)
  return (
    <Slider {...sliderSettings}>
      {productList?.map((prod) => (
        <ProductItem
          currentUser={currentUser}
          key={prod.id}
          product={prod}
          formated={true}
          watchList={watchList}
          onToggleWatchList={onToggleWatchList}
          isTogglingWatchList={isTogglingWatchList}
        />
      ))}
    </Slider>
  )
}
