import useCountdown from 'hooks/useCountdown'
import moment from 'moment'
import React from 'react'
import { RiAuctionFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { getImageURL } from 'utils/helpers/urlHelper'
const ProducListItem = ({ product = {} }) => {
  const { countdownTime } = useCountdown({ time: product.expiredDate })
  return (
    <div className='pt-2.5 pb-8 px-2.5 shadow-product bg-white rounded-[10px]'>
      <div className='relative rounded-[10px] overflow-hidden bg-[#f6f6ff] justify-center items-center flex'>
        {' '}
        <img src={getImageURL(product.avatarUrl)} alt='' />
      </div>
      <div className=''>
        <h6 className=' leading-7 text-xl py-4 font-medium text-[#171d1c]'>
          {product.name}
        </h6>
        <div className='flex flex-wrap'>
          <div className='py-3 px-2.5 flex items-center border-t-2 border-b-2 border-dotted border-[#deddf5] w-1/2 justify-center relative before:block before:absolute before:w-[1px] before:right-0 before:bottom-[15px] before:top-[15px] before:bg-[#bfbee8]'>
            <div className=' max-w-[36px] leading-none'>
              <RiAuctionFill color='#43b055' size='36px' />
            </div>
            <div className='max-w-[calc(100% - 30px)] pl-[15px]'>
              <div className='leading-5 text-sm text-[#43b055] mb-[5px] '>
                Giá hiện tại
              </div>
              <div className='leading-5 text-lg text-[#171d1c]'>
                {product.startPrice.toCurrency?.()}
              </div>
            </div>
          </div>
          <div className=' py-3 px-2.5 flex items-center border-t-2 border-b-2 border-dotted border-[#deddf5] w-1/2 justify-center relative'>
            <div className=' max-w-[36px] leading-none'>
              <RiMoneyDollarCircleFill color='ee4730' size='36px' />
            </div>
            <div className='max-w-[calc(100% - 30px)] pl-[15px]'>
              <div className='leading-5 text-sm text-[#ee4730] mb-[5px] '>
                Giá mua ngay
              </div>
              <div className='leading-5 text-lg text-[#171d1c]'>
                {product.purchasePrice?.toCurrency?.()}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center mt-[5px] text-lg mb-5 mx-2.5'>
          <div className='product-countdown'>{countdownTime}</div>
          <div className='pl-[35px] mt-[5px] text-[#43b055] border-l-[1px] border-[#d0cff0] leading-5'>
            {30} lần
          </div>
        </div>
        <div className='text-center'>
          <button className=' shadow-primary-button bg-gradient-to-t from-[#3da9f5] to-[#683df5] capitalize w-full max-w-[230px] text-white rounded-[30px] font-medium pt-3 pb-2.5 px-[30px] text-lg'>
            Đấu giá
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProducListItem
