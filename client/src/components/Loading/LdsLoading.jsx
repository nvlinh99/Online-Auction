import classNames from 'classnames'
import React from 'react'
import './lds-loading.scss'
const LdsLoading = ({ className, isFullscreen, isLoading }) => {
  if (!isLoading) {
    return null
  }
  return (
    <div
      className={classNames(
        className,
        isFullscreen &&
          'fixed z-[1000] inset-0 bg-[rgba(16,16,16,0.5)] flex-center'
      )}
    >
      <div className='lds-spinner text-white'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LdsLoading
