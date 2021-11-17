import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import './index.css'
import useCountdown from 'hooks/useCountdown'
const TimeLeft = ({
  initHoursLeft,
  initMinutesLeft,
  initSecondsLeft,
  date,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(0)
  // initHoursLeft * 60 * 60 + initMinutesLeft * 60 + initSecondsLeft
  const cdHook = useCountdown({ time: date })

  // useEffect(() => {
  //   console.log(initHoursLeft, initMinutesLeft, initSecondsLeft)
  //   setTotalSeconds(
  //     initHoursLeft * 60 * 60 + initMinutesLeft * 60 + initSecondsLeft
  //   )
  // }, [initHoursLeft, initMinutesLeft, initSecondsLeft])

  // const duration = moment.duration(totalSeconds, 'seconds')
  const duration = cdHook.duration
  const monthsLeft = Math.floor(duration.asMonths?.() || 0)
  const weeksLeft = duration.weeks?.() || 0
  const daysLeft = duration.days?.() || 0
  const hoursLeft = duration.hours?.() || 0
  const minutesLeft = duration.minutes?.() || 0
  const secondsLeft = duration.seconds?.() || 0
  if (totalSeconds > 0)
    setTimeout(() => {
      setTotalSeconds((totalSeconds) => totalSeconds - 1)
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
