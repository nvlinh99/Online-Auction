import _ from 'lodash'
import { Avatar } from '@mui/material'
import IconLike from '@mui/icons-material/ThumbUpAlt'
import IconUnLike from '@mui/icons-material/ThumbDownAlt'

const SellerBiderInfo = ({
  title,
  name,
  rateTotal,
  rateIncrease,
  rateDecrease,
  className,
}) => {
  return (
    <div className={className}>
      <p dangerouslySetInnerHTML={{ __html: title }}></p>
      <div className='flex items-center'>
        <Avatar style={{}} className='mr-2'>
          {_.toUpper(_.first(name)) || ''}
        </Avatar>
        <div className='flex'>
          <div className='mr-6'>
            <p>Họ tên:</p>
            <p>Điểm đánh giá:</p>
          </div>
          <div>
            <p>
              <strong style={{}}>{name || ''}</strong>
            </p>
            <p>
              <strong style={{ textDecoration: 'underline' }}>
                {rateTotal || 0} điểm
              </strong>{' '}
              (
              <strong className='rate-inc'>
                +{rateIncrease || 0} <IconLike className='rate-icon-up' />
              </strong>
              <strong> , </strong>{' '}
              <strong className='rate-desc'>
                -{rateDecrease || 0} <IconUnLike className='rate-icon-down' />
              </strong>
              )
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerBiderInfo
