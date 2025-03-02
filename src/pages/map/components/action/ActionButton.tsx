import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { DiceOption, DiceOrSkip, NextTurnParams, Player } from 'utils/types'
import DiceModal from './DiceModal'
import TurnModal from './TurnModal'
import BottomPanel from '../panel/BottomPanel'
import FormControl from '../panel/FormControl'

type Props = {
  handleNextTurn: (params: NextTurnParams) => void
  player: Player
  onMakingTurn: (open: boolean) => void
  onDiceRoll: (params: NextTurnParams) => void
}

export default function ActionButton({
  handleNextTurn,
  player,
  onMakingTurn,
  onDiceRoll,
}: Props) {
  const [turnModalOpen, setTurnModalOpen] = useState(false)
  const [diceModalOpen, setDiceModalOpen] = useState(false)

  const [dice, setDice] = useState<DiceOrSkip>('1d6')
  const [turnParams, setTurnParams] = useState<NextTurnParams | null>(null)

  const handleClick = () => {
    setTurnModalOpen(true)
    onMakingTurn(true)
  }

  const handleClose = () => {
    setTurnModalOpen(false)
    onMakingTurn(false)
  }

  const handleConfirm = (params: NextTurnParams, dice: DiceOption | 'skip') => {
    setTurnParams(params)
    setDice(dice)
    // setTurnModalOpen(false)

    if (params.type === 'completed' && player.map_position === 101) {
      setTurnModalOpen(false)
      handleNextTurn(params)
      return
    }

    if (dice === 'skip') {
      params.diceRoll = 0
      onDiceRoll(params)
      setTurnModalOpen(false)
    }
  }

  const handleTurnFinish = () => {
    if (!turnParams) {
      return
    }
    setDiceModalOpen(false)
    handleNextTurn(turnParams)
  }

  const handleDiceRoll = (roll: number[]) => {
    if (!turnParams) {
      return
    }
    const rollSum = roll.reduce((acc, val) => acc + val, 0)
    if (turnParams.type === 'drop' || turnParams.type === 'sheikh') {
      turnParams.diceRoll = -rollSum
    } else {
      turnParams.diceRoll = rollSum
    }
    setTurnParams({ ...turnParams })
    onDiceRoll(turnParams)
  }

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleClick}
        sx={{ width: '320px' }}
      >
        <strong>Сделать ход</strong>
      </Button>
      {turnModalOpen && (
        <BottomPanel>
          <FormControl
            player={player}
            onClose={handleClose}
            onTurnFinished={(result) => {
              handleDiceRoll(result)
              handleTurnFinish()
            }}
            onFormFinished={handleConfirm}
          />
        </BottomPanel>
      )}
      {/* <TurnModal
        open={turnModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        player={player}
      />
      <DiceModal
        open={diceModalOpen}
        dice={dice === 'skip' ? '1d6' : dice}
        onTurnFinish={handleTurnFinish}
        onDiceRoll={handleDiceRoll}
        player={player}
      /> */}
    </Box>
  )
}
