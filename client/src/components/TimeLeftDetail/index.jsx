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
        <div>{monthsLeft > 0 ? monthsLeft : 0}</div>
        <div>
          <strong>THÁNG </strong>
        </div>
      </div>
      <div className='time-block'>
        <div>{weeksLeft > 0 ? weeksLeft : 0}</div>
        <div>
          <strong>TUẦN </strong>
        </div>
      </div>
      <div className='time-block'>
        <div>{daysLeft > 0 ? daysLeft : 0}</div>
        <div>
          <strong>NGÀY </strong>
        </div>
      </div>

      <div className='time-block'>
        <div>{hoursLeft > 0 ? hoursLeft : 0}</div>
        <div>
          <strong>GIỜ </strong>
        </div>
      </div>

      <div className='time-block'>
        <div>{minutesLeft > 0 ? minutesLeft : 0}</div>
        <div>
          <strong>PHÚT </strong>
        </div>
      </div>

      <div className='time-block'>
        <div>{secondsLeft > 0 ? secondsLeft : 0}</div>
        <div>
          <strong>GIÂY</strong>
        </div>
      </div>
    </div>
  )
}

export default TimeLeft
