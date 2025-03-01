import { Box } from '@mui/material'
import RotatingCube from './RotatingCube'
import { useEffect, useState } from 'react'

type Props = {
  results: number[]
  showAmount: number
  animate: boolean
  onAnimationEnd: () => void
}

type AnimationState = 'idle' | 'animating' | 'finished'

export default function CubesGroup({
  results,
  showAmount,
  animate,
  onAnimationEnd,
}: Props) {
  const [animationsState, setAnimationsState] = useState<AnimationState[]>(
    Array(showAmount).fill('idle')
  )

  const allIdle = animationsState.every((a) => a === 'idle')

  useEffect(() => {
    if (animate && allIdle) {
      setAnimationsState((prev) => {
        const newAnimations = [...prev]
        newAnimations[0] = 'animating'
        return newAnimations
      })
    }
  }, [animate])

  const allAnimationsFinished = animationsState.every((a) => a === 'finished')

  useEffect(() => {
    if (allAnimationsFinished) {
      onAnimationEnd()
      setAnimationsState(Array(showAmount).fill('idle'))
    }
  }, [allAnimationsFinished])

  const handleAnimationEnd = (id: number) => {
    setAnimationsState((prev) => {
      const newAnimations = [...prev]
      newAnimations[id] = 'finished'
      if (id < showAmount - 1) {
        newAnimations[id + 1] = 'animating'
      }
      return newAnimations
    })
  }

  const amountArray = Array.from({ length: showAmount }, (_, i) => i)

  return (
    <Box display="flex">
      {amountArray.map((_, i) => (
        <RotatingCube
          key={i}
          result={results[i]}
          animate={animationsState[i] === 'animating'}
          onFinish={() => handleAnimationEnd(i)}
        />
      ))}
    </Box>
  )
}
