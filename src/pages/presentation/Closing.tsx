import { Box } from '@mui/material'
import { animated, useSpring } from '@react-spring/web'
import { Sponsor } from 'src/utils/api'
import { Player } from 'src/utils/types'
import CinemaImage from 'assets/cinema.png'
import { playerDisplayName } from '../player/components/utils'
import { Creators } from '../about/components/AboutContent'
import { useEffect, useRef, useState } from 'react'

import PlayerRed from 'assets/map/PlayerRed.webp'
import PlayerBlue from 'assets/map/PlayerBlue.webp'
import PlayerGreen from 'assets/map/PlayerGreen.webp'
import PlayerGreenLight from 'assets/map/PlayerGreenLight.webp'
import PlayerBlueLight from 'assets/map/PlayerBlueLight.webp'
import PlayerBlueDark from 'assets/map/PlayerBlueDark.webp'
import PlayerBrown from 'assets/map/PlayerBrown.webp'
import PlayerPink from 'assets/map/PlayerPink.webp'
import PlayerPinkLight from 'assets/map/PlayerPinkLight.webp'
import PlayerOrange from 'assets/map/PlayerOrange.webp'
import PlayerPurple from 'assets/map/PlayerPurple.webp'
import PlayerYellow from 'assets/map/PlayerYellow.webp'
import PlayerBiege from 'assets/map/PlayerBiege.webp'

type Props = {
  players: Player[]
  sponsors: Sponsor[]
}

export default function Closing({ players, sponsors }: Props) {
  const creditsRef = useRef<HTMLDivElement>(null)
  const [startPosition, setStartPosition] = useState(0)
  const [endPosition, setEndPosition] = useState(0)
  // const [creditsHeight, setCreditsHeight] = useState(0)

  useEffect(() => {
    if (creditsRef.current) {
      const creditsHeight = creditsRef.current.scrollHeight // Total height of the credits
      const marginTop = 120
      const viewportHeight = window.innerHeight - 50

      console.log('Credits height:', creditsHeight)
      console.log('Viewport height:', window.innerHeight)
      setStartPosition(viewportHeight) // Start entirely off-screen
      setEndPosition(-creditsHeight + 650) // End fully above the screen
    }
  }, [])

  const playersContent = players.map(
    (player) => `${player.first_name} «${playerDisplayName(player)}»`
  )

  playersContent.sort()

  const sponsorsContent = sponsors.map((sponsor) => sponsor.name)

  const creatorsContent = Creators.map((creator) => creator.name)

  const credits: Credit[] = [
    {
      title: 'Участники',
      content: playersContent,
    },
    {
      title: 'Спонсоры',
      content: sponsorsContent,
    },
    {
      title: 'Создатели',
      content: creatorsContent,
    },
  ]

  const [fadeStyles, fadeApi] = useSpring(() => ({
    opacity: 0,
    config: { duration: 3000 },
  }))

  const startFading = () => {
    fadeApi.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 3000 },
    })
  }

  const styles = useSpring({
    from: { transform: `translateY(${startPosition}px)` },
    to: { transform: `translateY(${endPosition}px)` },
    config: { duration: 50000 }, // Adjust speed here (in ms)
    onRest: () => {
      // show items after 3 seconds
      setTimeout(() => startFading(), 1000)
    },
  })
  // const styles = { top: -2100 }

  const animationLeftOffset = 150
  const animationTopOffset = 50

  return (
    <Box width="100%">
      <Box
        position="relative"
        width="100%"
        height={`${window.innerHeight - 20}px`}
        overflow="hidden"
        // style={{ backgroundColor: 'red' }}
      >
        <animated.div
          ref={creditsRef}
          className="credits"
          style={{
            ...styles,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            color: creditsRef.current ? ' white' : 'transparent',
            // border: '1px solid white',
          }}
        >
          {credits.map((credit, index) => (
            <Box marginBottom="150px" key={index}>
              <Box fontSize="36px" textAlign="center">
                {credit.title}
              </Box>
              {credit.content.map((content, index) => (
                <Box
                  fontSize="24px"
                  key={index}
                  textAlign="center"
                  marginTop="20px"
                >
                  {content}
                </Box>
              ))}
            </Box>
          ))}
          <Box fontSize="36px">Основано на идеях</Box>
          <Box fontSize="36px">Богдана «Lasqa» Вавилова</Box>
          <Box marginTop="150px" fontSize="32px">
            АУКУС 2024
          </Box>
          <Box marginTop="50px" position="relative">
            <img src={CinemaImage} alt="cinema" style={{ height: '420px' }} />
            <animated.div style={fadeStyles}>
              <Box
                position="absolute"
                left={-animationLeftOffset - 200}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerRed} delay={0} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset - 100}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerBlue} delay={500} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerGreen} delay={0} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset - 200}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerPinkLight} delay={500} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset - 100}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerOrange} delay={0} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerBlueLight} delay={500} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 200}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerGreenLight} delay={0} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 100}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerPink} delay={500} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset}
                top={animationTopOffset}
              >
                <AnimatedIcon image={PlayerBrown} delay={0} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 200}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerBlueDark} delay={500} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 100}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerPurple} delay={0} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset}
                top={animationTopOffset + 200}
              >
                <AnimatedIcon image={PlayerYellow} delay={500} />
              </Box>
            </animated.div>
          </Box>
        </animated.div>
      </Box>
    </Box>
  )
}

type Credit = {
  title: string
  content: string[]
}

type AnimationProps = {
  image: string
  delay: number
}

const AnimatedIcon = ({ image, delay }: AnimationProps) => {
  const delayRef = useRef(false)

  const [styles, api] = useSpring(() => ({
    y: 0,
    scale: 1.0,
    loop: true,
    config: { duration: 500 },
  }))

  useEffect(() => {
    // Apply initial delay before starting the animation
    const startAnimation = setTimeout(() => {
      delayRef.current = true // Mark delay as used
      api.start({
        loop: true,
        from: { y: 0, scale: 1.0 },
        to: [
          { y: -15, scale: 0.8 },
          { y: 0, scale: 1.0 },
        ],
        config: { duration: 500 },
      })
    }, delay)

    return () => clearTimeout(startAnimation) // Cleanup timeout
  }, [api, delay])

  return (
    <animated.div style={styles}>
      <img src={image} alt="Jumping" style={{ height: '100px' }} />
    </animated.div>
  )
}
