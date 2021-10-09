import moment from 'moment'
import React, { useEffect, useState } from 'react'

const useCountdown = ({ time }) => {
  const [countdownTime, setCountdownTime] = useState('')
  useEffect(() => {
    var start = moment(time)
    var seconds = start.seconds()
    const interval = setInterval(() => {
      const newTime = start
        .subtract(1, 'second')
        .format('DDD[d] : HH[h] : mm[m] : ss[s]')
      setCountdownTime(newTime)
      seconds--

      if (seconds === 0) clearInterval(interval)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  return { countdownTime }
}

export default useCountdown
