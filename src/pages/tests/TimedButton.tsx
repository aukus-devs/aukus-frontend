import { Box, Button, LinearProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import seedrandom from 'seedrandom'
import { DiceOption } from 'src/utils/types'

type Props = {
  onRoll: (result: number[]) => void
}

export default function TimedButton({ onRoll }: Props) {
  const [pressDuration, setPressDuration] = useState<number>(0)
  const [pressStart, setPressStart] = useState<number>(0)
  const [result, setResult] = useState<number[]>([])

  useEffect(() => {
    if (pressStart > 0) {
      const interval = setInterval(() => {
        setPressDuration(performance.now() - pressStart)
      }, 1)
      return () => clearInterval(interval)
    }
  }, [pressStart])

  const handleMouseDown = () => {
    setPressDuration(0)
    setPressStart(performance.now())
  }

  const handleMouseUp = () => {
    const diff = performance.now() - pressStart
    setPressDuration(diff)
    setPressStart(0)
    // make a string of diff to have 0 padded 1 digit after dot
    const seed = diff.toFixed(1)
    const rolls = rollsFromSeed(seed, '3d6')
    setResult(rolls)
    onRoll(rolls)
  }

  const seed = pressDuration.toFixed(1)

  const progressValue = (pressDuration * 100) / 5000

  return (
    <Box>
      <Button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        Click me
      </Button>
      <Box marginTop="20px" marginBottom="20px">
        <LinearProgress variant="determinate" value={progressValue} />
      </Box>
      <Box>Progress: {progressValue.toFixed(1)}%</Box>
      <Box>Press duration: {seed} ms</Box>
      <Box>Result: {result.toString()}</Box>
    </Box>
  )
}

export function rollsFromSeed(seed: string, dice: DiceOption): number[] {
  const gen = seedrandom(seed)
  const value1 = gen()
  const value2 = gen()
  const value3 = gen()

  if (dice === '1d6') {
    return [Math.floor(value1 * 6) + 1]
  }
  if (dice === '2d6') {
    return [Math.floor(value1 * 6) + 1, Math.floor(value2 * 6) + 1]
  }
  if (dice === '3d6') {
    return [
      Math.floor(value1 * 6) + 1,
      Math.floor(value2 * 6) + 1,
      Math.floor(value3 * 6) + 1,
    ]
  }
  if (dice === '1d4') {
    return [Math.floor(value1 * 4) + 1]
  }

  return []
}
