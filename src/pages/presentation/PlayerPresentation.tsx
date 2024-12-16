import { Box } from '@mui/material'
import { getPlayerColor, Player, PlayerUrl } from 'src/utils/types'
import FlashIcon from 'assets/icons/flash.svg?react'
import CrownImage from 'assets/icons/crown.svg?react'
import MedalImage from 'assets/icons/medal.svg?react'

import LasqaImage from 'assets/presentation/lasqa.png'
import MaddysonImage from 'assets/presentation/maddyson.png'
import UselessMouthImage from 'assets/presentation/uselessmouth.png'
import SegallImage from 'assets/presentation/segall.png'
import TimofeyImage from 'assets/presentation/timofey.png'

type PlayerContentType = {
  image: string
  video_link: string
  nomination_title: string
  funny_title: string
}

const PlayersContent: { [k in PlayerUrl]: PlayerContentType } = {
  browjey: {
    funny_title: 'He took the prize for style, not speed (most points)',
    nomination_title:
      'Превосходство человеческого интеллекта над искусственным',
    image: '',
    video_link: '',
  },
  keliq_q: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    image: '',
    video_link: '',
  },
  krabick: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    image: '',
    video_link: '',
  },
  lasqa: {
    funny_title: 'Nolan will stand aside',
    nomination_title: 'Сценарист года',
    image: LasqaImage,
    video_link: '',
  },
  maddyson: {
    funny_title: 'Men made a promise — the man did',
    nomination_title: 'Мужчина честной судьбы',
    image: '',
    video_link: MaddysonImage,
  },
  melharucos: {
    funny_title: 'Eternal Tsukuyomi consisting of JRPG',
    nomination_title: 'Преданный фанат восточной культуры',
    image: '',
    video_link: '',
  },
  praden: {
    funny_title: 'Самый',
    nomination_title: 'Самый',
    image: '',
    video_link: '',
  },
  roadhouse: {
    funny_title: 'Best drift on the map cells',
    nomination_title: 'НУЖНО ПРОСТО ПОДНЯТНЯТЬСЯ (ход на карте: 23 >> 5)',
    image: '',
    video_link: '',
  },
  segall: {
    funny_title: 'Owner of the lucky tickets',
    nomination_title: 'Лучший профессиональный дубляж',
    image: SegallImage,
    video_link: '',
  },
  timofey: {
    funny_title: "The fastest way to get an undertaker's license",
    nomination_title: 'Лучший гробовщик года',
    image: TimofeyImage,
    video_link: '',
  },
  unclebjorn: {
    funny_title: 'Unlucky in snakes-ladders — lucky in love',
    nomination_title: 'Везунчик наоборот',
    image: '',
    video_link: '',
  },
  uselessmouth: {
    funny_title: 'INVISIBLE',
    nomination_title:
      'Прошел "Jump King" за два часа что бы не слушать шутки о водолазах',
    image: UselessMouthImage,
    video_link: '',
  },
  vovapain: {
    funny_title: 'The road will be mastered by the walking',
    nomination_title: 'Король уличных дорог',
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
          <span>Премия в номинации: «{playerContent.nomination_title}»</span>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <Box
          // style={{ backgroundColor: playerColor }}
          width="900px"
          height="470px"
        >
          <img src={playerContent.image} style={{ height: '470px' }} />
        </Box>
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
