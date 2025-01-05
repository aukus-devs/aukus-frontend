import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Image from 'assets/icons/flash.svg?react'

type RotationState = {
  x: number
  y: number
  z: number
}

type Props = {
  result?: number
  onFinish?: () => void
  animate: boolean
}

type AnimationState = 'idle' | 'rotating' | 'ending'

export default function RotatingCube({ result, onFinish, animate }: Props) {
  const rotationRef = useRef<RotationState>(randomRotation())
  const rotation = rotationRef.current

  const [, setRefresh] = useState(false) // Dummy state to force re-render

  // Function to trigger a re-render
  const refresh = () => setRefresh((prev) => !prev)

  const animationStateRef = useRef<AnimationState>('idle')

  const stepTime = 1000
  const rotatingTotalTime = 3000
  const endingTime = 3000

  const lastAnimationTimeRef = useRef(0)
  const rotationStepTimeRef = useRef(stepTime)
  const rotationTotalTimeRef = useRef(rotatingTotalTime)
  const endingTimeRef = useRef(endingTime)

  const resetState = () => {
    rotationTotalTimeRef.current = rotatingTotalTime
    rotationStepTimeRef.current = stepTime
    endingTimeRef.current = endingTime
  }

  const finalRotation =
    result && result >= 1 && result <= 6
      ? FaceRotationTargets[result - 1]
      : undefined

  // Function to animate rotation to a target state
  const rotateTo = (target: RotationState) => {
    const animate = (time: number) => {
      const deltaMs = time - lastAnimationTimeRef.current
      const deltaSeconds = deltaMs / 1000
      // const rotationStep = degreesPerSecond * deltaSeconds
      lastAnimationTimeRef.current = time
      rotationTotalTimeRef.current -= deltaMs
      rotationStepTimeRef.current -= deltaMs

      // console.log('rotation speed', rotationStep)

      const currentRotation = rotationRef.current

      if (animationStateRef.current == 'rotating') {
        // Update each axis incrementally
        for (const axis of ['x', 'y', 'z'] as (keyof RotationState)[]) {
          // const random = Math.random() * 5
          const rotationStep = deltaSeconds * target[axis]
          currentRotation[axis] += rotationStep
        }
      }

      if (animationStateRef.current === 'ending') {
        const elapsed = endingTime - endingTimeRef.current

        const t = Math.min(1, elapsed / endingTime) * 0.5
        // console.log('elapsed', elapsed, 't', t)
        // console.log('step time', t)
        for (const axis of ['x', 'y', 'z'] as (keyof RotationState)[]) {
          const angle = lerpAngle(currentRotation[axis], target[axis], t)
          currentRotation[axis] = angle
        }
      }

      // Update state and continue animation if not done
      refresh()

      if (animationStateRef.current === 'ending') {
        endingTimeRef.current -= deltaMs

        const xDiff = Math.abs(currentRotation.x - target.x)
        const yDiff = Math.abs(currentRotation.y - target.y)
        const zDiff = Math.abs(currentRotation.z - target.z)

        const nxDiff = Math.min(xDiff, 360 - xDiff)
        const nyDiff = Math.min(yDiff, 360 - yDiff)
        const nzDiff = Math.min(zDiff, 360 - zDiff)

        // console.log('xDiff', nxDiff, 'yDiff', nyDiff, 'zDiff', nzDiff)

        if (
          (nxDiff < 1 && nyDiff < 1 && nzDiff < 1) ||
          endingTimeRef.current <= 0
        ) {
          console.log('animation finished')
          animationStateRef.current = 'idle'
          resetState()
          onFinish?.()
          return
        }
      }

      if (
        rotationTotalTimeRef.current < 0 &&
        animationStateRef.current === 'rotating'
      ) {
        animationStateRef.current = 'ending'
        endingTimeRef.current = endingTime
        if (finalRotation) {
          rotateTo(finalRotation)
        }
        return
      }

      if (
        animationStateRef.current === 'rotating' &&
        rotationStepTimeRef.current <= 0
      ) {
        console.log('step done', rotationRef.current)
        rotationStepTimeRef.current = stepTime
        rotateTo(randomRotation())
        return
      }

      requestAnimationFrame(animate)
    }

    animate(performance.now())
  }

  const startRotation = () => {
    animationStateRef.current = 'rotating'
    resetState()
    lastAnimationTimeRef.current = performance.now()
    rotateTo(randomRotation())
  }

  useEffect(() => {
    if (animate && finalRotation && animationStateRef.current === 'idle') {
      startRotation()
    }
  }, [animate, finalRotation])

  return (
    <Box>
      {/* {animationStateRef.current} */}
      <Box padding="50px" onClick={startRotation}>
        <div className="cube-container">
          <div
            className="cube"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            }}
          >
            <div className="face front">
              1
              <Image />
            </div>
            <div className="face bottom">2</div>
            <div className="face right">3</div>
            <div className="face left">4</div>
            <div className="face top">5</div>
            <div className="face back">
              6 <img src="/static/favicon.svg" width="20px" />
            </div>
          </div>
        </div>
      </Box>
    </Box>
  )
}

function randomRotation() {
  const randomX = Math.floor(Math.random() * 360) + 200
  const randomY = Math.floor(Math.random() * 360) + 200
  const randomZ = Math.floor(Math.random() * 360) + 200

  return {
    x: randomX,
    y: randomY,
    z: randomZ,
  }
}

const FaceRotationTargets = [
  // front
  { x: 0, y: 0, z: 0 },
  // bottom
  { x: 90, y: 0, z: 0 },
  // right
  { x: 90, y: 270, z: 90 },
  // left
  { x: 270, y: 90, z: 90 },
  // top
  { x: 270, y: 0, z: 0 },
  // back
  { x: 0, y: 180, z: 0 },
]

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

function lerpAngle(start: number, end: number, t: number): number {
  // Normalize angles to the range [0, 2π)
  const normalizedStart = normalizeAngle(start)
  const normalizedEnd = normalizeAngle(end)

  // Calculate the shortest path difference
  let delta = normalizedEnd - normalizedStart
  if (delta > 180) {
    delta -= 360 // Adjust for counterclockwise wrapping
  } else if (delta < -180) {
    delta += 360 // Adjust for clockwise wrapping
  }

  // Interpolate along the shortest path
  return normalizeAngle(normalizedStart + delta * t)
}
