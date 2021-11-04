import Pagination from 'components/Pagination'
import useQuery from 'hooks/useQuery'
import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { ratingApi } from 'services'
import { toast } from 'react-toastify'
import LdsLoading from 'components/Loading/LdsLoading'
import { pick } from 'lodash'
import useLogin from 'hooks/useLogin'
import { RATING_TYPE } from 'constants/enumConstants'
import RatingListItem from 'components/Rating/RatingListItem'

import { AiFillLike, AiFillDislike, AiFillStar } from 'react-icons/ai'
import classNames from 'classnames'

const RatingListPage = () => {
  const [ratings, setRatings] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedInUser, isLoggingUser, currentUser } = useLogin()
  const { query, onChange } = useQuery()
  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const type = query?.type ? parseInt(query.type) : -1
      const { succeeded, data } = await ratingApi.getUserRating({
        ...pick(query, ['page', 'limit']),
        type,
      })
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setRatings(data)
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }, [query])
  useEffect(() => {
    loadData()
  }, [loadData])
  const { isFilterByLike, isFilterByDisLike, isAll } = useMemo(() => {
    const type = query?.type ? parseInt(query?.type) : -1
    if (type === RATING_TYPE.LIKE) {
      return { isFilterByLike: true }
    }
    if (type === RATING_TYPE.DISLIKE) {
      return { isFilterByDisLike: true }
    }
    return { isAll: true }
  }, [query?.type])

  return (
    <div className='container mx-auto mt-[40px]'>
      <LdsLoading isFullscreen isLoading={isLoading} />
      <div className='flex-col md:flex-row shadow-pane mb-10 border border-[rgba(13, 21, 75, 0.15)] rounded-[5px] flex-between py-[30px] px-4'>
        <h1 className='panel-title'>Danh Sách đánh giá</h1>
        <div className='flex-center text-[#171d1c] text-base'>
          <button
            className={classNames(
              'mr-3 flex items-center border px-3 py-1 rounded-lg shadow-sm hover:shadow-product hover:bg-opacity-50 text-[#E4A834]',
              isFilterByLike && 'border-[#E4A834]'
            )}
            onClick={() => onChange('type', 0)}
          >
            {ratings.totalLike}
            <AiFillLike className='ml-0.5' fill='#E4A834' size='20px' />
          </button>
          <button
            className={classNames(
              'mr-3 flex items-center border px-3 py-1 rounded-lg shadow-sm hover:shadow-product hover:bg-opacity-50 text-[#B13A1A]',
              isFilterByDisLike && 'border-[#B13A1A]'
            )}
            onClick={() => onChange('type', 1)}
          >
            {ratings.totalDisLike}
            <AiFillDislike className='ml-0.5' fill='#B13A1A' size='20px' />
          </button>
          <button
            className={classNames(
              'mr-3 flex items-center border px-3 py-1 rounded-lg shadow-sm hover:shadow-product hover:bg-opacity-50 text-[#942dd9]',
              isAll && 'border-[#942dd9]'
            )}
            onClick={() => onChange('type', -1)}
          >
            {ratings.totalLike - ratings.totalDisLike}
            <AiFillStar className='ml-0.5' size='24px' color='#942dd9' />
          </button>
        </div>
      </div>
      <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-[35px] '>
        {ratings?.items?.map((rating) => {
          return <RatingListItem key={rating.id} rating={rating} />
        })}
      </div>
      <Pagination
        page={query?.page || 1}
        pageCount={ratings.totalPages}
        onChange={onChange}
        containerClassName='mb-[35px]'
      />
    </div>
  )
}

export default RatingListPage
