import { Box, Button } from '@mui/material'
import { getPlayerColor, Player } from 'src/utils/types'
import { Link } from 'react-router-dom'
import LinkSpan from 'src/components/LinkSpan'
import { PlayerPhotoMap } from './utils'

type Props = {
  player: Player
}

export default function PlayerTile({ player }: Props) {
  const photo = PlayerPhotoMap[player.url_handle]
  const playerColor = getPlayerColor(player.url_handle)
  const linkColor = 'rgba(255,255,255,0.8)'
  return (
    <Box
      // height={'255px'}
      width={'380px'}
      style={{ backgroundColor: playerColor }}
      borderRadius={'15px'}
      padding={'15px'}
      lineHeight={'1.2'}
      position={'relative'}
    >
      <Box
        position={'absolute'}
        top={'15px'}
        right={'15px'}
        textTransform={'uppercase'}
        fontSize={'12px'}
      >
        {player.is_online ? 'стримит' : 'оффлайн'}
      </Box>
      <Box fontSize={'32px'}>
        {player.first_name}
        <br />«{player.name}»
      </Box>
      <Box display="flex" marginTop={'20px'}>
        <Box>
          <img src={photo} style={{ height: '100px', borderRadius: '10px' }} />
        </Box>
        <Box
          fontSize={'16px'}
          color={'rgba(255,255,255,0.8)'}
          width={'200px'}
          display={'flex'}
          flexWrap={'wrap'}
          gap={'10px'}
          lineHeight={'1.2'}
          alignContent={'flex-start'}
          justifyContent={'flex-end'}
        >
          {player.twitch_stream_link && (
            <Box>
              <Link
                to={player.twitch_stream_link}
                target="_blank"
                rel="noopener nereferrer"
              >
                <LinkSpan defaultColor={linkColor} color={'white'}>
                  Твич
                </LinkSpan>
              </Link>
            </Box>
          )}
          {player.vk_stream_link && (
            <Link
              to={player.vk_stream_link}
              target="_blank"
              rel="noopener nereferrer"
            >
              <LinkSpan defaultColor={linkColor} color={'white'}>
                ВК Видео
              </LinkSpan>
            </Link>
          )}
          {player.kick_stream_link && (
            <Link
              to={player.kick_stream_link}
              target="_blank"
              rel="noopener nereferrer"
            >
              <LinkSpan defaultColor={linkColor} color={'white'}>
                Кик
              </LinkSpan>
            </Link>
          )}
          {player.telegram_link && (
            <Link
              to={player.telegram_link}
              target="_blank"
              rel="noopener nereferrer"
            >
              <LinkSpan defaultColor={linkColor} color={'white'}>
                Телеграм
              </LinkSpan>
            </Link>
          )}
          {player.donation_link && (
            <Link
              to={player.donation_link}
              target="_blank"
              rel="noopener nereferrer"
            >
              <LinkSpan defaultColor={linkColor} color={'white'}>
                Донейшен
              </LinkSpan>
            </Link>
          )}
        </Box>
      </Box>
      <Box marginTop={'10px'}>
        <Button sx={{ width: '100%' }} color={'customGreyLight'}>
          Страница стримера
        </Button>
      </Box>
    </Box>
  )
}
