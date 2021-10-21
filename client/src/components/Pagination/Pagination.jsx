import React from 'react'
import ReactPaginate from 'react-paginate'
import { CgArrowLeft, CgArrowRight } from 'react-icons/cg'
import classNames from 'classnames'
const pageClassname = 'p-[5px]'
const pageLinkClassname =
  'block w-[50px] h-[50px] rounded-full  leading-[50px] text-center bg-white border border-[rgba(234, 234, 234, 0.1)] text-[#52606d] font-bold shadow-pageLink'

const Pagination = ({
  pageCount = 1,
  page = 1,
  onChange,
  containerClassName,
}) => {
  if (pageCount === 1) {
    return null
  }
  return (
    <ReactPaginate
      previousLabel={<CgArrowLeft />}
      nextLabel={<CgArrowRight />}
      breakLabel={'...'}
      pageCount={pageCount}
      initialPage={parseInt(page - 1)}
      forcePage={parseInt(page - 1)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={({ selected }) => onChange('page', selected + 1)}
      containerClassName={classNames(
        'flex justify-center items-center',
        containerClassName
      )}
      breakClassName={classNames(pageClassname)}
      pageClassName={classNames(pageClassname)}
      previousClassName={classNames(pageClassname)}
      nextClassName={classNames(pageClassname)}
      pageLinkClassName={classNames(pageLinkClassname)}
      breakLinkClassName={classNames(pageLinkClassname)}
      previousLinkClassName={classNames(
        pageLinkClassname,
        'flex items-center justify-center'
      )}
      nextLinkClassName={classNames(
        pageLinkClassname,
        'flex items-center justify-center'
      )}
      activeLinkClassName='!text-white bg-gradient-to-tl from-[#f22876] to-[#942dd9]'
    />
  )
}

export default Pagination
