import { Box } from '@mui/material'
import { animated, useSpring } from '@react-spring/web'
import { Sponsor } from 'src/utils/api'
import { Player } from 'src/utils/types'
import CinemaImage from 'assets/cinema.png'
import { playerDisplayName } from '../player/components/utils'
import { Creators } from '../about/components/AboutContent'
import { useEffect, useRef, useState } from 'react'

import DiceAnimation from 'assets/dice.gif'

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

  const playersSection = {
    title: 'В главных ролях',
    content: playersContent,
  }

  const sponsorsSection = {
    title: 'Спонсоры сайта',
    content: sponsorsContent,
  }

  const creatorsSection = {
    title: 'Создатели сайта',
    content: creatorsContent,
  }

  const [fadePlayersStyles, fadePlayersApi] = useSpring(() => ({
    opacity: 0,
    config: { duration: 3000 },
  }))

  const [fadeDiceStyles, fadeDiceApi] = useSpring(() => ({
    opacity: 0,
    config: { duration: 3000 },
  }))

  const startFading = () => {
    fadeDiceApi.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 3000 },
      onRest: () => {
        fadePlayersApi.start({
          from: { opacity: 0 },
          to: { opacity: 1 },
          config: { duration: 3000 },
        })
      },
    })
  }

  const styles = useSpring({
    from: { transform: `translateY(${startPosition}px)` },
    to: { transform: `translateY(${endPosition}px)` },
    config: { duration: 80 * 1000 }, // Adjust speed here (in ms)
    onRest: () => {
      // show items after 3 seconds
      setTimeout(() => startFading(), 2000)
    },
  })
  // const styles = { top: -2100 }

  const animationLeftOffset = 150
  const animationTopOffset = 20

  const sideOffsetTop = 40
  const botOffsetTop = 300

  return (
    <Box width="100%">
      <Box
        position="relative"
        width="100%"
        height={`${window.innerHeight - 20}px`}
        overflow="hidden"
        style={{ pointerEvents: 'none' }}
        fontFamily={'MursGothicWide'}
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
          <Box marginBottom="150px">
            <Box
              fontSize="36px"
              textAlign="center"
              fontFamily="MursGothicMassive"
            >
              {playersSection.title}
            </Box>
            {playersSection.content.map((content, index) => (
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

          <Box marginBottom="150px">
            <Box
              fontSize="36px"
              textAlign="center"
              fontFamily="MursGothicMassive"
            >
              А также
            </Box>

            <Box fontSize="24px" textAlign="center" marginTop="20px">
              Поддерживающие зрители
            </Box>
            <Box fontSize="24px" textAlign="center" marginTop="20px">
              Неунывающие донатеры
            </Box>
            <Box fontSize="24px" textAlign="center" marginTop="20px">
              Справедливые модераторы
            </Box>
          </Box>

          <Box marginBottom="150px">
            <Box
              fontSize="36px"
              textAlign="center"
              fontFamily="MursGothicMassive"
            >
              {sponsorsSection.title}
            </Box>
            {sponsorsSection.content.map((content, index) => (
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

          <Box marginBottom="150px">
            <Box
              fontSize="36px"
              textAlign="center"
              fontFamily="MursGothicMassive"
            >
              {creatorsSection.title}
            </Box>
            {creatorsSection.content.map((content, index) => (
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

          <Box fontSize="36px" fontFamily="MursGothicMassive">
            Основано на идеях и сценарии
          </Box>
          <Box fontSize="36px" fontFamily="MursGothicMassive">
            Богдана «Lasqa» Вавилова
          </Box>
          <Box marginTop="150px" fontSize="32px" fontFamily="MursGothicMassive">
            АУКУС 2024
          </Box>
          <Box marginTop="50px" position="relative">
            <img src={CinemaImage} alt="cinema" style={{ height: '420px' }} />
            <animated.div style={fadeDiceStyles}>
              <Box
                position="absolute"
                left={-animationLeftOffset - 120}
                top={animationTopOffset + 150}
              >
                <img
                  src={DiceAnimation}
                  alt="dice"
                  style={{ height: '100px' }}
                />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 120}
                top={animationTopOffset + 150}
              >
                <img
                  src={DiceAnimation}
                  alt="dice"
                  style={{ height: '100px' }}
                />
              </Box>
            </animated.div>
            <animated.div style={fadePlayersStyles}>
              <Box
                position="absolute"
                left={-animationLeftOffset - 200}
                top={animationTopOffset + sideOffsetTop}
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
                top={animationTopOffset + sideOffsetTop}
              >
                <AnimatedIcon image={PlayerGreen} delay={0} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset - 200}
                top={animationTopOffset + botOffsetTop - sideOffsetTop}
              >
                <AnimatedIcon image={PlayerPinkLight} delay={500} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset - 100}
                top={animationTopOffset + botOffsetTop}
              >
                <AnimatedIcon image={PlayerOrange} delay={0} />
              </Box>
              <Box
                position="absolute"
                left={-animationLeftOffset}
                top={animationTopOffset + botOffsetTop - sideOffsetTop}
              >
                <AnimatedIcon image={PlayerBlueLight} delay={500} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 200}
                top={animationTopOffset + sideOffsetTop}
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
                top={animationTopOffset + sideOffsetTop}
              >
                <AnimatedIcon image={PlayerBrown} delay={0} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 200}
                top={animationTopOffset + botOffsetTop - sideOffsetTop}
              >
                <AnimatedIcon image={PlayerBlueDark} delay={500} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset - 100}
                top={animationTopOffset + botOffsetTop}
              >
                <AnimatedIcon image={PlayerPurple} delay={0} />
              </Box>
              <Box
                position="absolute"
                right={-animationLeftOffset}
                top={animationTopOffset + botOffsetTop - sideOffsetTop}
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
    // return
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

    return () => clearTimeout(startAnimation)
  }, [api, delay])

  return (
    <animated.div style={styles}>
      <img src={image} alt="Jumping" style={{ height: '100px' }} />
    </animated.div>
  )
}
