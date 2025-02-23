import { Box } from '@mui/material'
import { Color } from 'src/utils/types'
import Wheel, { WheelOption } from './Wheel'
import { useState } from 'react'

export default function DifficultyWheel() {
  const options = [
    {
      title: 'Нормальная',
      value: 'normal',
      color: Color.blue,
      percentage: 80,
    },
    {
      title: 'Очень сложная',
      value: 'very-hard',
      color: Color.red,
      percentage: 5,
    },
    {
      title: 'Легкая',
      value: 'easy',
      color: Color.green,
      percentage: 5,
    },
    {
      title: 'Сложная',
      value: 'hard',
      color: Color.orange,
      percentage: 10,
    },
  ]

  const [winner, setWinner] = useState<WheelOption | null>(null)

  const descriptions: { [k: string]: string } = {
    normal: 'стандартная сложность для игры',
    'very-hard': 'вторая сложность выше стандартой',
    easy: 'сложность перед стандартной',
    hard: 'сложность выше стандартной',
  }

  return (
    <Box>
      {winner && (
        <Box display="flex" justifyContent="center" textAlign="center">
          {winner.title}
          <br />({descriptions[winner.value]})
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
