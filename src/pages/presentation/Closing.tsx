import { Box } from '@mui/material'
import { useSpring, animated } from 'react-spring'
import { Sponsor } from 'src/utils/api'
import { Player } from 'src/utils/types'
import CinemaImage from 'assets/cinema.png'
import { playerDisplayName } from '../player/components/utils'
import { Creators } from '../about/components/AboutContent'
import { useEffect, useRef, useState } from 'react'

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
      setStartPosition(window.innerHeight - 150) // Start entirely off-screen
      setEndPosition(-creditsHeight - 0) // End fully above the screen
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

  const styles = useSpring({
    from: { transform: `translateY(${startPosition}px)` },
    to: { transform: `translateY(${endPosition}px)` },
    config: { duration: 50000 }, // Adjust speed here (in ms)
  })

  return (
    <Box marginTop="120px" width="100%">
      <Box
        position="relative"
        width="100%"
        height={`${window.innerHeight - 140}px`}
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
          <Box fontSize="36px"> Богдана «Lasqa» Вавилова</Box>
          <Box marginTop="150px" fontSize="32px">
            AUKUS 2024
          </Box>
          <Box marginTop="50px">
            <img src={CinemaImage} alt="cinema" style={{ width: '100%' }} />
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
