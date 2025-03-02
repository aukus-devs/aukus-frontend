import { Box, Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import CubesGroup from 'src/pages/map/components/panel/dice/CubesGroup'
import { makeDiceRoll } from 'src/utils/api'
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

  const { mutateAsync: doDiceRoll } = useMutation({
    mutationFn: makeDiceRoll,
  })

  const onAnimationEnd = () => {
    setTurnFinished(true)
  }

  const handleStartThrow = () => {
    setAnimateDice(true)
    doDiceRoll({
      num: diceAmount,
      min: 1,
      max: 6,
      is_test: false,
    }).then((response) => {
      setThrowResults(response.data)
    })
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
