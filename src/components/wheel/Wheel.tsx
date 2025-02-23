import React from 'react'
import { Box, Button, Input } from '@mui/material'
import {
  blue,
  blueGrey,
  brown,
  green,
  indigo,
  orange,
  pink,
  purple,
  teal,
} from '@mui/material/colors'
import { useContext, useEffect, useRef, useState } from 'react'
// import { MusicContext } from '@/common/hooks/MusicContext'
// import { Item, MusicType } from '@/pages/turnir/types'
// import CatDance from '@/assets/cat_dance.webp'
import { indexOf, random } from 'lodash'

type WheelState =
  | 'idle'
  | 'acceleration'
  | 'constant-speed'
  | 'deceleration'
  | 'stop'

export type WheelOption = {
  title: string
  value: string
  color: string
  percentage: number
}

type Props = {
  options: WheelOption[]
  onAnimationEnd: (option: WheelOption) => void
  centerImage?: string
  // music?: MusicType
}

export default function Wheel({
  options,
  onAnimationEnd,
  centerImage,
  // music,
}: Props) {
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef<number | null>(null)
  const rotationRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const speedRef = useRef<number>(0)

  const [wheelState, setWheelState] = useState<WheelState>('idle')
  const wheelStateRef = useRef<WheelState>('idle')

  const updateState = (state: WheelState) => {
    setWheelState(state)
    wheelStateRef.current = state
  }

  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [hasBacktrack, setHasBacktrack] = useState<boolean>(
    () => Math.random() > 0.5
  )
  const [initialAngle, setInitialAngle] = useState<number>(() =>
    degreesToRadians(random(0, 360))
  )

  // const { setMusicPlaying } = useContext(MusicContext)
  // useEffect(() => {
  //   if (isFinished && !music) {
  //     setMusicPlaying(undefined)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isFinished, music])

  const amountOfItems = options.length
  const optionsTotalValue = options.reduce(
    (acc, option) => acc + option.percentage,
    0
  )

  const size = 400
  const sizeOffset = 0
  const diameter = size - sizeOffset
  const radius = diameter / 2 + 2
  const centerX = diameter / 2
  const centerY = diameter / 2

  const itemsAngles: Array<{
    start: number
    end: number
    degreeStart: number
    degreeEnd: number
    title: string
  }> = []
  let startAngle = 0
  for (let i = 0; i < amountOfItems; i++) {
    const itemAngle = 2 * Math.PI * (options[i].percentage / optionsTotalValue)
    itemsAngles.push({
      start: startAngle,
      end: startAngle + itemAngle,
      degreeStart: radiansToDegrees(startAngle),
      degreeEnd: radiansToDegrees(startAngle + itemAngle),
      title: options[i].title,
    })
    startAngle += itemAngle
  }

  const darkenedColors = options.map((option) =>
    darkenHexColor(option.color, 50)
  )

  const getSelectedItemId = (rotation: number, debug?: boolean) => {
    const topAngleRadians = (3 / 2) * Math.PI
    const relativeTopAngle =
      (topAngleRadians - rotation - initialAngle + 2 * Math.PI) % (2 * Math.PI)

    const index = itemsAngles.findIndex(
      (item) => relativeTopAngle >= item.start && relativeTopAngle < item.end
    )
    // debug &&
    //   console.log(
    //     'item detection',
    //     rotation,
    //     relativeTopAngle,
    //     radiansToDegrees(relativeTopAngle),
    //     index,
    //     itemsAngles
    //   )
    return index
  }

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(() =>
    getSelectedItemId(rotationRef.current)
  )

  useEffect(() => {
    rotationRef.current = 0
    speedRef.current = 0
    updateState('idle')
    setIsFinished(false)
    setHasBacktrack(Math.random() > 0.5)
    setInitialAngle(degreesToRadians(random(0, 360)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentOption: WheelOption | undefined = options[currentItemIndex]

  useEffect(() => {
    if (isFinished && currentOption) {
      onAnimationEnd(currentOption)
    }
  }, [isFinished, currentOption])

  const colors = [
    indigo[500],
    teal[500],
    pink[500],
    orange[800],
    green[600],
    blue[500],
    purple[300],
    blueGrey[500],
    brown[500],
    purple[800],
  ]

  const centerRadius = 30

  const arrowPath = new Path2D()
  arrowPath.moveTo(centerX, centerY - radius + 30)
  arrowPath.lineTo(centerX - 30, centerY - radius)
  arrowPath.lineTo(centerX - 18, centerY - radius + 2)
  arrowPath.lineTo(centerX, centerY - radius + 20)
  arrowPath.lineTo(centerX + 18, centerY - radius + 2)
  arrowPath.lineTo(centerX + 30, centerY - radius)
  arrowPath.lineTo(centerX, centerY - radius + 30)

  const lineSeparator = new Path2D()
  lineSeparator.moveTo(0, 0)
  lineSeparator.lineTo(radius * Math.cos(0), radius * Math.sin(0))

  const drawWheel = (
    rotation: number,
    selectedIndex: number,
    debug?: boolean
  ) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    // const selectedIndex = getSelectedItemId(rotationRef.current)
    // console.log(canvas, context, rotation);
    if (context) {
      context.save()
      context.translate(sizeOffset / 2, sizeOffset / 2)
      context.translate(centerX, centerY)
      context.rotate(rotation + initialAngle)

      context.font = '16px Tahoma'
      const textOffsetFromCenter = 60
      for (let i = 0; i < amountOfItems; i++) {
        // const color = colors[i % colors.length]
        const option = options[i]

        context.fillStyle = option.color
        if (wheelStateRef.current === 'stop' && i !== selectedIndex) {
          context.fillStyle = '#6b6b6b'
        }

        // const itemAngle = 2 * Math.PI * (option.percentage / optionsTotalValue)
        const optionAngles = itemsAngles[i]

        const angleDiff = optionAngles.end - optionAngles.start

        const piece = new Path2D()
        piece.moveTo(0, 0)
        piece.arc(0, 0, radius, 0, angleDiff)
        piece.lineTo(0, 0)

        context.fill(piece)
        context.strokeStyle = 'white'
        context.lineWidth = 2
        context.stroke(lineSeparator)

        const angleHalf = angleDiff / 2

        context.save()
        context.rotate(angleHalf)
        let text = options[i].title
        const textWidth = context.measureText(text).width
        // console.log("radius", radius);
        // console.log("text", text, textWidth);
        if (textWidth + textOffsetFromCenter > radius) {
          // console.log("replacing", text);
          text = text.slice(0, 17) + '...'
        }

        context.fillStyle = 'white'
        context.fillText(text, textOffsetFromCenter, 5)
        context.restore()

        context.rotate(angleDiff)
      }
      context.strokeStyle = 'white'
      context.lineWidth = 2
      context.stroke(lineSeparator)

      context.restore()

      context.fillStyle = 'white'
      context.strokeStyle = 'black'
      context.lineWidth = 2
      context.fill(arrowPath)
      context.stroke(arrowPath)
    }
  }

  // const onRefChange = (canvas: HTMLCanvasElement | null) => {
  //   canvasRef.current = canvas
  // }

  const startSpeed = 0.00009
  const slowestSpeed = 0.0006
  const fastestSpeed = 0.2
  const acceleration = 0.0005

  const decelerationSteps: Array<Array<number>> = []
  const decelerationPercent = 20
  let currentStep = fastestSpeed
  while (currentStep > slowestSpeed) {
    currentStep = (currentStep / 100) * (100 - decelerationPercent)
    decelerationSteps.push([currentStep, 500])
  }

  const backtrackSpeed = -0.001
  const backtrackTime = 2500 + 700 * Math.random()

  const lastDebugTime = useRef<number>(0)

  const animate = (time: number) => {
    if (timeRef.current) {
      const delta = time - timeRef.current

      // let debug = false
      // const debugDelta = time - lastDebugTime.current
      // if (debugDelta > 3000) {
      //   console.log(
      //     'angle',
      //     rotationRef.current,
      //     radiansToDegrees(rotationRef.current)
      //   )
      //   lastDebugTime.current = time
      //   debug = true
      // }

      if (delta > 5) {
        // console.log(wheelState.current, speedRef.current, rotationRef.current);
        switch (wheelStateRef.current) {
          case 'acceleration':
            speedRef.current += acceleration
            if (speedRef.current >= fastestSpeed) {
              updateState('constant-speed')
              const randomTime =
                Math.random() * 1500 + Math.random() * 1000 + 1500
              setTimeout(() => {
                updateState('deceleration')
              }, randomTime)
            }
            break
          case 'deceleration':
            let timer = 0
            for (const item of decelerationSteps) {
              if (speedRef.current > item[0]) {
                speedRef.current = item[0]
                timer = item[1]
                break
              }
            }
            if (speedRef.current <= slowestSpeed) {
              if (hasBacktrack) {
                speedRef.current = backtrackSpeed
                updateState('constant-speed')
                // console.log("start backtracking", speedRef.current);
                setTimeout(() => {
                  setIsFinished(true)
                  speedRef.current = 0
                  updateState('stop')
                }, backtrackTime)
              } else {
                setIsFinished(true)
                speedRef.current = 0
                updateState('stop')
              }
            } else {
              setTimeout(() => {
                updateState('deceleration')
              }, timer)
              // console.log("setting timer", timer, "for speed", speedRef.current);
              updateState('constant-speed')
            }
            break
          default:
            break
        }
        rotationRef.current = rotationRef.current + speedRef.current
        if (rotationRef.current >= 2 * Math.PI) {
          rotationRef.current = 0
        }
        const newSelectedIndex = getSelectedItemId(rotationRef.current)
        drawWheel(rotationRef.current, newSelectedIndex)
        timeRef.current = time

        setCurrentItemIndex((old: number) => {
          // console.log("new index", newSelectedIndex);
          if (newSelectedIndex !== old) {
            //console.log(rotationPiece % pieces);
            // console.log(
            //   'setting new index',
            //   newSelectedIndex,
            //   // old,
            //   options[newSelectedIndex],
            //   radiansToDegrees(rotationRef.current),
            //   initialAngle
            // )
            return newSelectedIndex
          }
          return old
          // return newSelectedIndex;
        })
      }
    } else {
      timeRef.current = time
      // animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length, initialAngle])

  const startSpinning = () => {
    if (wheelState === 'idle') {
      // setMusicPlaying(music || MusicType.Wheel)
      updateState('acceleration')
      speedRef.current = startSpeed
    }
  }

  const displayCenterImage = !['idle', 'stop'].includes(wheelState)

  const CatDance =
    'https://cdn.7tv.app/emote/01HSVPHY80000BF22ZE9ZB6234/3x.avif'

  return (
    <>
      {/* <Input
        value={radiansToDegrees(initialAngle)}
        onChange={(evt) =>
          setInitialAngle(
            degreesToRadians(Number.parseFloat(evt.target.value || '0'))
          )
        }
      /> */}
      <Box
        style={{ justifyContent: 'center', display: 'flex', paddingTop: '5px' }}
      >
        <Box
          style={{
            position: 'relative',
            margin: 0,
            padding: 0,
            width: `${size + 10}px`,
            height: `${size + 10}px`,
            borderWidth: '4px',
            borderStyle: 'solid',
            borderRadius: '50%',
            borderColor: 'red',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: wheelState === 'idle' ? 'pointer' : 'default',
            clipPath: 'circle(52%)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={size + 10}
            height={size + 10}
            onClick={startSpinning}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 1,
              opacity: wheelState === 'idle' ? 0.5 : 1,
            }}
          />
          <Box
            onClick={startSpinning}
            style={{
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 2,
              width: `${size + 12}px`,
              height: `${size + 12}px`,
              borderRadius: '50%',
              borderColor: 'white',
              borderWidth: '6px',
              borderStyle: 'solid',
            }}
          />
          <Box
            onClick={startSpinning}
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              zIndex: 2,
              width: `${size + 4}px`,
              height: `${size + 4}px`,
              borderRadius: '50%',
              borderColor: 'black',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
          />

          {wheelState === 'idle' && (
            <Button
              onClick={startSpinning}
              variant="contained"
              style={{
                zIndex: 10,
              }}
            >
              Закрутить
            </Button>
          )}

          <img
            src={centerImage || CatDance}
            alt=""
            style={{
              position: 'absolute',
              display: displayCenterImage ? 'block' : 'none',
              top: `${size / 2 - centerRadius}px`,
              left: `${size / 2 - centerRadius}px`,
              width: centerRadius * 2,
              height: centerRadius * 2,
              zIndex: 5,
            }}
            onClick={startSpinning}
          />
        </Box>
      </Box>
    </>
  )
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI
}

function darkenHexColor(hex: string, percent: number): string {
  // Ensure the hex code starts with "#"
  if (!hex.startsWith('#')) {
    throw new Error("Invalid hex color format. It should start with '#'.")
  }

  // Remove the "#" and parse the color components
  const hexWithoutHash = hex.slice(1)
  const bigint = parseInt(hexWithoutHash, 16)
  let r = (bigint >> 16) & 255
  let g = (bigint >> 8) & 255
  let b = bigint & 255

  // Darken each component by the given percentage
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent / 100))))
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent / 100))))
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent / 100))))

  // Convert back to a hex string
  const darkenedHex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
  return darkenedHex
}
