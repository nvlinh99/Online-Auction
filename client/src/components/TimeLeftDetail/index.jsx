import { useState } from 'react'
import moment from 'moment'
import './index.css'
const TimeLeft = ({ initHoursLeft, initMinutesLeft, initSecondsLeft }) => {
  const [totalSeconds, setTotalSeconds] = useState(
    initHoursLeft * 60 * 60 + initMinutesLeft * 60 + initSecondsLeft
  )

  const duration = moment.duration(totalSeconds, 'seconds')
  const monthsLeft = Math.floor(duration.asMonths())
  const weeksLeft = duration.weeks()
  const daysLeft = duration.days()
  const hoursLeft = duration.hours()
  const minutesLeft = duration.minutes()
  const secondsLeft = duration.seconds()
  if (totalSeconds > 0)
    setTimeout(() => {
      setTotalSeconds(totalSeconds - 1)
    }, 1000)
  // setTimeout(() => {
  //   if (secondsLeft > 0) return setSe
  // }, 1000)
  return (
    <div className='product-detail-time-left text-center flex'>
      <div className='time-block'>
        <div>
          <strong>{monthsLeft > 0 ? monthsLeft : 0}</strong>
        </div>
        <div>
          <span>THÁNG</span>
        </div>
      </div>
      <div className='time-block'>
        <div>
          <strong>{weeksLeft > 0 ? weeksLeft : 0}</strong>
        </div>
        <div>
          <span>TUẦN</span>
        </div>
      </div>
      <div className='time-block'>
        <div>
          <strong>{daysLeft > 0 ? daysLeft : 0}</strong>
        </div>
        <div>
          <span>NGÀY</span>
        </div>
      </div>

      <div className='time-block'>
        <div>
          <strong>{hoursLeft > 0 ? hoursLeft : 0}</strong>
        </div>
        <div>
          <span>GIỜ</span>
        </div>
      </div>

      <div className='time-block'>
        <div>
          <strong>{minutesLeft > 0 ? minutesLeft : 0}</strong>
        </div>
        <div>
          <span>PHÚT</span>
        </div>
      </div>

      <div className='time-block'>
        <div>
          <strong>{secondsLeft > 0 ? secondsLeft : 0}</strong>
        </div>
        <div>
          <span>GIÂY</span>
        </div>
      </div>
    </div>
  )
}

export default TimeLeft
