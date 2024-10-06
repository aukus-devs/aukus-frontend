import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import DiceBox from '@3d-dice/dice-box'
import { DiceOption } from 'utils/types'

type Props = {
  open: boolean
  dice: DiceOption | null
  onTurnFinish: (diceRoll: number) => void
  onDiceRoll: (diceRoll: number) => void
}

const DiceBoxContainerId = 'dice-box'
const DiceBoxContainer = '#dice-box'

type DiceRoll = {
  value: number
}

type DiceBoxType = {
  canvas: HTMLCanvasElement
  init: () => Promise<void>
  roll: (dice: string) => Promise<Array<DiceRoll>>
  clear: () => void
  config: {
    themeColor: string
  }
}

export default function DiceModal({
  open,
  dice,
  onTurnFinish,
  onDiceRoll,
}: Props) {
  const [diceRoll, setDiceRoll] = useState<Array<number> | null>(null)
  const [diceStatus, setDiceStatus] = useState<
    'idle' | 'rolling' | 'done' | 'clear'
  >('idle')

  const [diceBox, setDiceBox] = useState<DiceBoxType | null>(null)
  const [diceColor, setDiceColor] = useState<string>(getRandomHexColor())

  const diceRollSum = diceRoll
    ? diceRoll.reduce((acc, value) => acc + value, 0)
    : null

  const isTurnComplete =
    diceRoll !== null && diceStatus === 'done' && diceRollSum

  const canThrowDice = diceStatus === 'idle'

  useEffect(() => {
    if (!open) {
      setDiceRoll(null)
      setDiceStatus('idle')
      if (diceBox) {
        diceBox.clear()
      }
    }
  }, [open, diceBox])

  const handleActionClick = () => {
    if (canThrowDice) {
      throwDice()
    } else if (isTurnComplete) {
      onTurnFinish(diceRollSum)
    }
  }

  const containerRef = useCallback(
    (node: HTMLDivElement) => {
      if (
        node !== null &&
        (!diceBox || (open && !document.getElementById(diceBox.canvas.id)))
      ) {
        const diceBox = new DiceBox({
          assetPath: '/static/assets/',
          container: DiceBoxContainer,
          scale: 11,
          themeColor: diceColor,
          // delay: 100,
        })
        diceBox.init().then(() => {
          setDiceBox(diceBox)
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [diceBox, open]
  )

  const throwDice = () => {
    if (diceStatus !== 'idle' || !dice || !diceBox) {
      return
    }

    setDiceStatus('rolling')
    diceBox.roll(dice).then((result: Array<DiceRoll>) => {
      setDiceRoll(result.map((diceRoll) => diceRoll.value))
      setDiceStatus('done')
      const diceSum = result.reduce((acc, value) => acc + value.value, 0)
      onDiceRoll(diceSum)
    })
  }

  const handleTestThrow = () => {
    if (diceBox && dice) {
      setDiceRoll(null)
      diceBox.roll(dice).then((result: Array<DiceRoll>) => {
        setDiceRoll(result.map((diceRoll) => diceRoll.value))
      })
      const newColor = getRandomHexColor()
      setDiceColor(newColor)
      diceBox.config.themeColor = newColor
    }
  }

  const showAllDices = diceRoll !== null && diceRoll.length > 1
  const diceRollDisplay = showAllDices
    ? ` — ${diceRollSum} (${diceRoll.join(', ')})`
    : ` — ${diceRollSum}`

  const useDarkText = isBright(diceColor)

  return (
    <Dialog open={open} fullWidth keepMounted>
      <DialogTitle
        fontSize={'24px'}
        style={{
          paddingTop: '30px',
          paddingLeft: '30px',
          lineHeight: '1',
          paddingBottom: '30px',
          paddingRight: '30px',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box>
            Бросок кубика
            {diceRollSum && diceRollDisplay}
          </Box>
          {diceStatus === 'idle' && (
            <Button
              disableRipple
              onClick={handleTestThrow}
              style={{
                backgroundColor: diceColor,
                color: useDarkText ? 'black' : 'white',
              }}
            >
              Тестовый бросок
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
        }}
      >
        <div
          id={DiceBoxContainerId}
          style={{
            display: 'flex',
            position: 'relative',
            justifyContent: 'center',
            height: '200px',
            border: '2px solid #414141',
            borderRadius: '10px',
            padding: '5px',
          }}
          ref={containerRef}
        ></div>
      </DialogContent>
      <DialogActions
        style={{
          paddingTop: 0,
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
        }}
      >
        <Button
          fullWidth
          onClick={handleActionClick}
          disabled={!(diceStatus === 'idle' || diceStatus === 'done')}
          color="secondary"
          variant="contained"
        >
          {diceStatus === 'idle' ? `Бросить кубик — ${dice}` : 'Ходить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function getRandomHexColor(): string {
  // Helper function to convert a number to a two-digit hex string
  const toHex = (n: number): string => n.toString(16).padStart(2, '0')

  // Generate random numbers for red, green, and blue components
  const r = Math.floor(Math.random() * 256) // Red component (0-255)
  const g = Math.floor(Math.random() * 256) // Green component (0-255)
  const b = Math.floor(Math.random() * 256) // Blue component (0-255)

  // Return the hexadecimal color code as a string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToRgb(hex: string): [number, number, number] {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '')

  // Parse the string and convert to decimal values
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b]
}

function isBright(hexColor: string): boolean {
  const [r, g, b] = hexToRgb(hexColor)

  // Convert RGB to the 0-1 range
  let rNorm = r / 255
  let gNorm = g / 255
  let bNorm = b / 255

  // Apply gamma correction
  rNorm =
    rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4)
  gNorm =
    gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4)
  bNorm =
    bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4)

  // Calculate luminance
  const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm

  // Return true if too bright for dark text
  return luminance > 0.45
}