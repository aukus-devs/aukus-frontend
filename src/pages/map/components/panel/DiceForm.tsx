import { Box, Button } from '@mui/material'
import { useState } from 'react'
import CubesGroup from 'src/pages/map/components/panel/dice/CubesGroup'
import { DiceOption } from 'src/utils/types'

const DiceChangeMaps: { [k: string]: { [k: string]: DiceOption } } = {
  '2d6': {
    '1d6': '2d6',
    '2d6': '1d6',
  },
  '3d6': {
    '1d6': '2d6',
    '2d6': '3d6',
    '3d6': '1d6',
  },
}

type Props = {
  onTurnFinished: (results: number[]) => void
  dice: DiceOption
}

export default function DiceForm({ onTurnFinished, dice }: Props) {
  const [turnFinished, setTurnFinished] = useState(false)
  const [animateDice, setAnimateDice] = useState(false)
  const [throwResults, setThrowResults] = useState<number[]>([1, 1, 1])

  const diceAmount = parseInt(dice[0])

  const onAnimationEnd = () => {
    setTurnFinished(true)
  }

  const handleStartThrow = () => {
    setAnimateDice(true)
    setTimeout(() => {
      const results = Array.from(
        { length: diceAmount },
        () => Math.floor(Math.random() * 6) + 1
      )
      setThrowResults(results)
    }, 10)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center">
        <CubesGroup
          results={throwResults}
          showAmount={diceAmount}
          animate={animateDice}
          onAnimationEnd={onAnimationEnd}
        />
      </Box>
      {!turnFinished && !animateDice && (
        <Button onClick={handleStartThrow}>Бросить кубики</Button>
      )}
      {turnFinished && (
        <Button onClick={() => onTurnFinished(throwResults)}>Ходить</Button>
      )}
    </Box>
  )
}
