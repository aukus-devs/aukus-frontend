import { Box } from '@mui/material'
import { Color } from 'src/utils/types'
import Wheel, { WheelOption } from '../wheel/Wheel'
import { useState } from 'react'

export default function DifficultyWheel() {
  const options = [
    {
      title: 'Дроп',
      value: 'drop',
      color: Color.red,
      percentage: 50,
    },
    {
      title: 'Продолжать',
      value: 'keep',
      color: Color.blue,
      percentage: 50,
    },
  ]

  const [winner, setWinner] = useState<WheelOption | null>(null)

  return (
    <Box>
      {winner && (
        <Box display="flex" justifyContent="center" textAlign="center">
          {winner.title}
        </Box>
      )}
      <Wheel
        options={options}
        onAnimationEnd={(winner) => {
          setWinner(winner)
        }}
      />
    </Box>
  )
}
