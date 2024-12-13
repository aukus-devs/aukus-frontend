import { Box } from '@mui/material'
import { useSpring, animated } from 'react-spring'
import { Sponsor } from 'src/utils/api'
import { Player } from 'src/utils/types'
import CinemaImage from 'assets/cinema.png'
import { playerDisplayName } from '../player/components/utils'
import { Creators } from '../about/components/AboutContent'

type Props = {
  players: Player[]
  sponsors: Sponsor[]
}

export default function Closing({ players, sponsors }: Props) {
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
    from: { transform: 'translateY(75%)' },
    to: { transform: 'translateY(-30%)' },
    config: { duration: 30000 }, // Adjust speed here (in ms)
  })

  return (
    <Box marginTop="120px">
      <Box
        position="relative"
        width="700px"
        height="85vh"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <animated.div
          className="credits"
          style={{
            ...styles,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            marginTop: '-100px',
            // border: '1px solid white',
          }}
        >
          {credits.map((credit, index) => (
            <Box marginBottom="150px" key={index} color="white">
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
          <Box fontSize="35px">Основано на идеях</Box>
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
