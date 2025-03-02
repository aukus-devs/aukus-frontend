import { Box, Button } from '@mui/material'
import { useState } from 'react'
import GameReviewForm from './GameReviewForm'
import DiceForm from './DiceForm'
import { DiceOption, DiceOrSkip, NextTurnParams, Player } from 'src/utils/types'

type Props = {
  player: Player
  onClose: () => void
  onTurnFinished: (results: number[]) => void
  onFormFinished: (params: NextTurnParams, dice: DiceOrSkip) => void
}

type FormStep = 'game-review' | 'dice-throw'

export default function FormControl({
  player,
  onClose,
  onTurnFinished,
  onFormFinished,
}: Props) {
  const [formStep, setFormStep] = useState<FormStep>('game-review')

  return (
    <Box>
      {formStep === 'game-review' && (
        <GameReviewForm
          onFinished={(params, dice) => {
            onFormFinished(params, dice)
            setFormStep('dice-throw')
          }}
          player={player}
          onClose={onClose}
        />
      )}
      {formStep === 'dice-throw' && (
        <DiceForm dice="3d6" onTurnFinished={onTurnFinished} />
      )}
    </Box>
  )
}
