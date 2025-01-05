import { Box } from '@mui/material'
import TimedButton from './TimedButton'
import CubesGroup from './CubesGroup'
import { useState } from 'react'

export default function DiceRollContainer() {
  const [animate, setAnimate] = useState(false)
  const [roll, setRoll] = useState<number[]>([])

  const handleRoll = (result: number[]) => {
    setRoll(result)
    setAnimate(true)
  }

  const handleAnimationEnd = () => {
    setAnimate(false)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <TimedButton onRoll={handleRoll} />
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <CubesGroup
          results={roll}
          showAmount={3}
          animate={animate}
          onAnimationEnd={handleAnimationEnd}
        />
      </Box>
    </Box>
  )
}
