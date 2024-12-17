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
import VovapainImage from 'assets/presentation/pain.png'
import RoadhouseImage from 'assets/presentation/roadhouse.png'

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
    video_link: '/uploads/browjey.mp4',
  },
  keliq_q: {
    funny_title: 'Тише едешь — дальше будешь',
    nomination_title: 'Больше всего пройдённых игр',
    image: '',
    video_link: '/uploads/keliQ_Q.mp4',
  },
  krabick: {
    funny_title: 'Any% speedrun aukus',
    nomination_title: 'Через тернии звёздам, минуя дропы и змейки',
    image: '',
    video_link: '/uploads/krabick2.mp4',
  },
  lasqa: {
    funny_title: 'Nolan will stand aside',
    nomination_title: 'Сценарист года',
    image: LasqaImage,
    video_link: '/uploads/lasqa.mp4',
  },
  maddyson: {
    funny_title: 'Men made a promise — the man did',
    nomination_title: 'Мужчина честной судьбы',
    image: MaddysonImage,
    video_link: '/uploads/maddyson2.mp4',
  },
  melharucos: {
    funny_title: 'Eternal Tsukuyomi consisting of JRPG',
    nomination_title: 'Преданный фанат восточной культуры',
    image: '',
    video_link: '/uploads/melharucos2.mp4',
  },
  praden: {
    funny_title: 'Тихий прохоДэн',
    nomination_title: 'Там где прошёл он... Там упала звезда',
    image: '',
    video_link: '/uploads/praden.mp4',
  },
  roadhouse: {
    funny_title: 'Best drift on the map cells',
    nomination_title: 'НУЖНО ПРОСТО ПОДНЯТНЯТЬСЯ (ход на карте: 23 >> 5)',
    image: RoadhouseImage,
    video_link: '/uploads/roadhouse2.mp4',
  },
  segall: {
    funny_title: 'Owner of the lucky tickets',
    nomination_title: 'Лучший профессиональный дубляж',
    image: SegallImage,
    video_link: '/uploads/segall3.mp4',
  },
  timofey: {
    funny_title: "The fastest way to get an undertaker's license",
    nomination_title: 'Лучший гробовщик года',
    image: TimofeyImage,
    video_link: '/uploads/timofey_new.mp4',
  },
  unclebjorn: {
    funny_title: 'Unlucky in snakes-ladders — lucky in love',
    nomination_title: 'Везунчик наоборот',
    image: '',
    video_link: '/uploads/unclebjorn3.mp4',
  },
  uselessmouth: {
    funny_title: 'INVISIBLE',
    nomination_title:
      'Прошел "Jump King" за два часа что бы не слушать шутки о водолазах',
    image: UselessMouthImage,
    video_link: '/uploads/UselessMouth0.mp4',
  },
  vovapain: {
    funny_title: 'The road will be mastered by the walking',
    nomination_title: 'Король уличных дорог',
    image: VovapainImage,
    video_link: '/uploads/vovapain.mp4',
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
    <Box textAlign="center" marginTop="150px" lineHeight="1.2" zIndex="20">
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
          // display="flex"
          textAlign="center"
          // alignItems="flex-start"
        >
          <Box display="flex" alignItems="flex-start" justifyContent="center">
            <MedalImage
              style={{ marginRight: '0px', width: '48px', height: '48px' }}
            />
            Премия в номинации:
          </Box>
          <span>«{playerContent.nomination_title}»</span>
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
        >
          <VideoPlayer videoLink={playerContent.video_link} />
        </Box>
      </Box>
    </Box>
  )
}

type VideoProps = {
  videoLink: string
}

function VideoPlayer({ videoLink }: VideoProps) {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
    backgroundColor: '#f4f4f4',
  }

  const videoStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    border: '2px solid #ccc',
    borderRadius: '10px',
    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  }

  return (
    <Box style={containerStyle}>
      <video key={videoLink} controls style={videoStyle}>
        <source src={videoLink} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  )
}
