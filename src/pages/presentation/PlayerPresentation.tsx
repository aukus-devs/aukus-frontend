import { Box } from '@mui/material'
import { getPlayerColor, Player, PlayerUrl } from 'src/utils/types'
import FlashIcon from 'assets/icons/flash.svg?react'
import CrownImage from 'assets/icons/crown.svg?react'
import MedalImage from 'assets/icons/medal.svg?react'

type PlayerContentType = {
  image: string
  video_link: string
  nomination_title: string
  nomination_description: string
  funny_title: string
}

const PlayersContent: { [k in PlayerUrl]: PlayerContentType } = {
  browjey: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  keliq_q: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  krabick: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  lasqa: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  maddyson: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  melharucos: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  praden: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  roadhouse: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  segall: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  timofey: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  unclebjorn: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  uselessmouth: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
  vovapain: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    nomination_description: 'Самый',
    image: '',
    video_link: '',
  },
}

type Props = {
  player: Player
  place: number
}

export default function PlayerPresentation({ player, place }: Props) {
  const playerColor = getPlayerColor(player.url_handle)
  const playerContent = PlayersContent[player.url_handle]

  return (
    <Box textAlign="center" marginTop="150px" lineHeight="1.2">
      <Box
        fontSize="24px"
        color={playerColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CrownImage style={{ marginRight: '5px' }} />
        {place}-ое место
      </Box>
      <Box
        fontSize="64px"
        fontWeight="700"
        marginTop="20px"
        fontFamily="MursGothicMassive"
      >
        {player.first_name} «{player.name}»
      </Box>
      <Box
        fontSize="24px"
        marginTop="30px"
        fontWeight="1000"
        textTransform="uppercase"
        fontStyle="italic"
        color={playerColor}
      >
        {playerContent.funny_title}
      </Box>
      <Box display="flex" justifyContent="center">
        <Box
          marginTop="200px"
          fontSize="40px"
          color={playerColor}
          maxWidth="830px"
          display="flex"
          textAlign="center"
          alignItems="flex-start"
        >
          <MedalImage
            style={{ marginRight: '0px', width: '48px', height: '48px' }}
          />
          <span>Премия в номинации: {playerContent.nomination_title}</span>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <Box
          style={{ backgroundColor: playerColor }}
          width="900px"
          height="470px"
        >
          <img
            src={playerContent.image}
            style={{ width: '900px', height: '470px' }}
          />
        </Box>
      </Box>
      <Box marginTop="30px" fontSize="24px">
        {playerContent.nomination_description}
      </Box>
      <Box
        marginTop="200px"
        fontSize="40px"
        color={playerColor}
        display="flex"
        justifyContent="center"
      >
        <FlashIcon
          style={{
            alignSelf: 'center',
            width: '48px',
            height: '48px',
            marginRight: '10px',
          }}
        />
        Топовый клип за ивент
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <Box
          style={{ backgroundColor: playerColor }}
          width="900px"
          height="470px"
          marginBottom="300px"
        ></Box>
      </Box>
    </Box>
  )
}
