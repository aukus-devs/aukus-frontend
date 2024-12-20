import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField,
  Tooltip,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import DiceBackground from 'assets/deck-background.png'
import DiceBackgroundSpecial from 'assets/dice-background-special1.png'

import DiceBox from '@mapcar/dice-box'
import { Color, DiceOption, Player } from 'utils/types'
import { Link } from 'react-router-dom'
import LinkSpan from 'src/components/LinkSpan'
import { Info } from '@mui/icons-material'

type Props = {
  open: boolean
  dice: DiceOption
  onTurnFinish: () => void
  onDiceRoll: (diceRoll: number) => void
  player: Player
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

const diceChangeMaps: { [k: string]: { [k: string]: DiceOption } } = {
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

export default function DiceModal({
  player,
  open,
  dice: maxDice,
  onTurnFinish,
  onDiceRoll,
}: Props) {
  const [diceRoll, setDiceRoll] = useState<Array<number> | null>(null)
  const [diceStatus, setDiceStatus] = useState<
    'idle' | 'rolling' | 'done' | 'clear'
  >('idle')

  const [diceBox, setDiceBox] = useState<DiceBoxType | null>(null)
  const [diceColor, setDiceColor] = useState<string>(getRandomHexColor(player))

  const [showGoogleIframe, setShowGoogleIframe] = useState(false)
  const [showRollIframe, setShowRollIframe] = useState(false)

  const [customRoll, setCustomRoll] = useState<number | null>(null)

  const [currentDice, setCurrentDice] = useState<DiceOption>(maxDice)

  const diceAmount = parseInt(currentDice[0])

  useEffect(() => {
    if (maxDice !== currentDice) {
      setCurrentDice(maxDice)
    }
  }, [maxDice])

  const diceRollSum = diceRoll
    ? diceRoll.reduce((acc, value) => acc + value, 0)
    : null

  const isTurnComplete =
    diceStatus === 'done' &&
    ((diceRoll !== null && diceRollSum) || customRoll !== null)

  const canThrowDice = diceStatus === 'idle'

  const diceCanBeChanged = maxDice in diceChangeMaps
  const changeMap = diceChangeMaps[maxDice] ?? {}
  const changeOption = changeMap[currentDice] ?? null

  const changeDice = (option: DiceOption) => {
    setCurrentDice(changeOption)
  }

  useEffect(() => {
    if (!open) {
      setDiceRoll(null)
      setDiceStatus('idle')
      setShowGoogleIframe(false)
      setShowRollIframe(false)
      setCustomRoll(null)
      if (diceBox) {
        diceBox.clear()
      }
    }
  }, [open, diceBox])

  const handleActionClick = () => {
    if (canThrowDice) {
      throwDice()
    } else if (isTurnComplete) {
      if (customRoll !== null) {
        onDiceRoll(customRoll)
      }
      onTurnFinish()
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
          scale: 9,
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
    if (diceStatus !== 'idle' || !diceBox) {
      return
    }

    setDiceStatus('rolling')
    diceBox.roll(currentDice).then((result: Array<DiceRoll>) => {
      setDiceRoll(result.map((diceRoll) => diceRoll.value))
      setDiceStatus('done')
      const diceSum = result.reduce((acc, value) => acc + value.value, 0)
      onDiceRoll(diceSum)
    })
  }

  const handleTestThrow = () => {
    if (diceBox && diceStatus === 'idle') {
      setDiceRoll(null)
      diceBox.roll(currentDice).then((result: Array<DiceRoll>) => {
        setDiceRoll(result.map((diceRoll) => diceRoll.value))
      })
      const newColor = getRandomHexColor(player)
      setDiceColor(newColor)
      diceBox.config.themeColor = newColor
    }
  }

  const handleGoogleThrow = () => {
    setShowGoogleIframe(true)
    setDiceStatus('done')
  }

  const handleRollADieThrow = () => {
    setShowRollIframe(true)
    setDiceStatus('done')
  }

  const showAllDices = diceRoll !== null && diceRoll.length > 1
  const diceRollDisplay = showAllDices
    ? ` — ${diceRollSum} (${diceRoll.join(', ')})`
    : ` — ${diceRollSum}`

  const useDarkText = isBright(diceColor)
  const canTestThrow = diceStatus === 'idle'

  const diceBackground =
    player.name === 'UselessMouth' ? DiceBackgroundSpecial : DiceBackground

  let rollADieUrl = `https://rolladie.net/roll-${diceAmount}-dice`
  if (maxDice === '1d4') {
    rollADieUrl = 'https://rolladie.net/roll-a-d4-die'
  }

  return (
    <Dialog open={open} keepMounted maxWidth="md">
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
            Бросок кубика {currentDice}
            {diceRollSum && diceRollDisplay}
          </Box>
          {diceStatus === 'idle' && (
            <Box>
              {diceCanBeChanged && changeOption && (
                <Button
                  style={{
                    fontSize: '14px',
                    marginRight: '10px',
                    width: '158px',
                  }}
                  onClick={() => changeDice(changeOption)}
                >
                  Сменить на {changeOption}
                </Button>
              )}
              <Button
                disableRipple
                onClick={handleTestThrow}
                style={{
                  display: 'none',
                  backgroundColor: diceColor,
                  color: useDarkText ? 'black' : 'white',
                  fontSize: '14px',
                }}
              >
                Тестовый бросок
              </Button>
            </Box>
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
        {!showGoogleIframe && !showRollIframe && (
          <>
            <Box
              border={`2px solid ${Color.greyLight}`}
              borderRadius="10px"
              marginBottom="15px"
              padding="10px"
            >
              <Box display="flex" alignItems="center">
                <Info style={{ marginRight: '10px' }} />
                Бросок реализован с помощью эмулятора физики кубиков:
              </Box>
              <Box marginLeft="35px">
                <Link
                  to="https://fantasticdice.games/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkSpan color={Color.blue}>fantasticdice.games</LinkSpan>
                </Link>
              </Box>
              <Box marginLeft="35px">
                Можно делать тестовые броски нажимая на поле
              </Box>
            </Box>
            <Tooltip
              title={canTestThrow ? 'Тестовый бросок' : ''}
              placement="top"
            >
              <div
                id={DiceBoxContainerId}
                onClick={handleTestThrow}
                style={{
                  display: 'flex',
                  position: 'relative',
                  justifyContent: 'center',
                  width: '640px',
                  height: '260px',
                  border: '2px solid #414141',
                  borderRadius: '10px',
                  padding: '5px',
                  boxSizing: 'border-box',
                  backgroundImage: `url(${diceBackground})`,
                  cursor: canTestThrow ? 'pointer' : 'default',
                }}
                ref={containerRef}
              ></div>
            </Tooltip>
          </>
        )}
        {showGoogleIframe && (
          <Box>
            <iframe
              src={`https://www.google.com/search?q=${currentDice}+dice&igu=1`}
              style={{ width: '740px', height: '520px' }}
            ></iframe>
          </Box>
        )}
        {showRollIframe && (
          <Box>
            <iframe
              src={rollADieUrl}
              style={{ width: '640px', height: '480px' }}
            ></iframe>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        style={{
          paddingTop: 0,
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
        }}
      >
        <Box display="block" width="100%">
          {diceStatus === 'idle' && (
            <Box display="flex">
              <Button
                fullWidth
                onClick={handleActionClick}
                color="secondary"
                variant="contained"
                sx={{ width: '100%' }}
              >
                Бросить кубик — {currentDice}
              </Button>
            </Box>
          )}
          <Box width="100%">
            {diceStatus === 'done' && (showGoogleIframe || showRollIframe) && (
              <TextField
                fullWidth
                placeholder="Суммарный результат броска"
                sx={{ height: '44px', marginBottom: '20px' }}
                value={customRoll ?? ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (value >= 1 && value <= 100) {
                    setCustomRoll(value)
                  } else {
                    setCustomRoll(null)
                  }
                }}
                InputProps={{
                  style: {
                    paddingTop: '10px',
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    paddingBottom: '10px',
                    lineHeight: '1.2',
                    fontSize: '16px',
                    fontWeight: 500,
                  },
                }}
              />
            )}
            {diceStatus === 'done' && (
              <Button
                fullWidth
                onClick={handleActionClick}
                color="secondary"
                variant="contained"
                disabled={!isTurnComplete}
              >
                Ходить
              </Button>
            )}
          </Box>

          {diceStatus === 'idle' && (
            <Box marginTop="20px" display="flex">
              <Button
                style={{ marginRight: '20px', width: '100%' }}
                onClick={handleGoogleThrow}
              >
                Бросить через google.com
              </Button>
              <Button style={{ width: '100%' }} onClick={handleRollADieThrow}>
                Бросить через rolladie.net
              </Button>
            </Box>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

function getRandomHexColor(player: Player): string {
  if (player.name === 'UselessMouth') {
    return '#fffff0'
  }

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
