import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

const getMSKTime = () => {
  // returns hour and minute without seconds
  const date = new Date()
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  })
}

export default function Clock() {
  const [time, setTime] = useState(getMSKTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getMSKTime())
    }, 10 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box style={{ fontStyle: 'italic' }}>
      <span className={'mono'}>{time}</span> МСК
    </Box>
  )
}
