import { Avatar } from '@mui/material'
import classNames from 'classnames'
import { RATING_TYPE } from 'constants/enumConstants'
import moment from 'moment'
import React, { useMemo } from 'react'
import { AiFillDislike, AiFillLike, AiFillStar } from 'react-icons/ai'
const RatingListItem = ({ rating = {} }) => {
  const rateByFullName = useMemo(() => {
    const { rateBy } = rating || {}
    const fullname = rateBy?.firstName + ' ' + rateBy?.lastName
    return fullname
  }, [rating])
  return (
    <div className='pt-2.5 pb-8 px-2.5 shadow-product bg-white rounded-[10px]'>
      <div className='flex items-center mb-2'>
        <Avatar
          className={classNames('!bg-white mr-2  border border-[#942dd9]', {
            'border-[#E4A834]': rating.type === RATING_TYPE.LIKE,
            'border-[#B13A1A]': rating.type === RATING_TYPE.DISLIKE,
          })}
        >
          {rating.type === RATING_TYPE.LIKE ? (
            <AiFillLike className='ml-0.5' fill='#E4A834' size='20px' />
          ) : rating.type === RATING_TYPE.DISLIKE ? (
            <AiFillDislike className='ml-0.5' fill='#B13A1A' size='20px' />
          ) : (
            <AiFillStar className='ml-0.5' size='24px' color='#942dd9' />
          )}
        </Avatar>
        <div className=''>
          <h3 className='text-sm font-bold'>{rateByFullName}</h3>
          <p className='text-[12px] text-[#484848] font-light'>
            {moment(rating.createdAt).format('MMM DD YYYY')}
          </p>
        </div>
      </div>
      <p className='text-sm'>{rating.comment}</p>
    </div>
  )
}

export default RatingListItem
