import moment from 'moment'
import React, { useEffect, useState } from 'react'

const useCountdown = ({ time }) => {
  const [countdownTime, setCountdownTime] = useState('0d 0h 00m 00s')
  const [duration, setDuration] = useState({})
  useEffect(() => {
    const diff = moment(time).diff(moment(), 'milliseconds')
    if (diff < 0) {
      setCountdownTime('Hết hạn')
      return null
    }
    let duration = moment.duration(diff)

    const interval = setInterval(() => {
      setDuration(duration)
      setCountdownTime(
        `${Math.floor(
          duration.asDays()
        )}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
      )

      duration = duration.clone().subtract(1, 'seconds')
      if (duration.asSeconds === 0) clearInterval(interval)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [time])

  return { countdownTime, duration }
}

export default useCountdown
