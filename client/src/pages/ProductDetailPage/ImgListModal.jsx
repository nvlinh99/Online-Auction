import { Modal, Box } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import Slider from 'react-slick'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '700px',
  maxWidth: '80%',
  maxHeight: '90%',
  // height: '500px',
  aspectRatio: '1 / 1',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 0,
}

const sliderSettings = {
  dots: true,
  //lazyLoad: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 2,
}

const ImgListModal = ({ imgUrlList, pRef, currIdx }) => {
  const [open, setOpen] = useState(false)

  pRef.current.openModal = () => {
    setOpen(true)
  }
  pRef.current.closeModal = () => {
    setOpen(false)
  }

  const slider = useRef({})
  // useEffect(() => {
  //   isOpen && slider.current.slickGoTo && slider.current.slickGoTo(currIdx)
  // }, [currIdx, isOpen])

  return (
    <Modal
      open={open}
      onClose={pRef.current.closeModal}
      // aria-labelledby='modal-modal-title'
      // aria-describedby='modal-modal-description'
    >
      <Box sx={modalStyle}>
        <div
          id='imgListModalSliderOuter'
          style={{ height: '100%', width: '100%', position: 'relative' }}
        >
          <Slider ref={slider} {...sliderSettings}>
            {imgUrlList?.map((imgUrl) => (
              <div id='imgCnt' key={imgUrl}>
                <img className='product-img' src={imgUrl} />
              </div>
            ))}
          </Slider>
        </div>
      </Box>
    </Modal>
  )
}

export default ImgListModal
