import { useEffect } from 'react'
import { animated, useSpring } from '@react-spring/web'

type Props = {
  image: string
  isJumping?: boolean
  scale?: number
}

export default function JumpingIcon({ image, isJumping, scale }: Props) {
  const [styles, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1.0,
    config: { duration: 1000 },
  }))

  const scaleValue = scale || 1.0

  useEffect(() => {
    if (isJumping) {
      api.start({
        loop: true,
        from: { x: 0, y: 0, scale: 1.0 },
        to: [
          { x: 0, y: -10, scale: 0.8 },
          { x: 0, y: 0, scale: 1.0 },
        ],
        config: { duration: 500 },
      })
    } else {
      api.stop()
    }
  }, [isJumping])

  return (
    <animated.img
      src={image}
      style={{
        ...styles,
        width: `${40 * scaleValue}px`,
        verticalAlign: 'middle',
        filter: 'drop-shadow(0px -1px 15px rgba(0,0,0,1.0))',
        zIndex: 20,
      }}
    />
  )
}
