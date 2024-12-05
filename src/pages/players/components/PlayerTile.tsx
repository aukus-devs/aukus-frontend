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
      width={'380px'}
      style={{ backgroundColor: playerColor }}
      borderRadius={'15px'}
      lineHeight={'1.2'}
      position={'relative'}
      paddingTop={'15px'}
      paddingBottom={'15px'}
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
      <Box fontSize={'32px'} paddingLeft={'15px'}>
        {player.first_name}
        <br />«{player.name}»
      </Box>
      <Box marginTop={'10px'}>
        <img src={photo} style={{ width: '380px', height: '234px' }} />
      </Box>
      <Box
        marginTop={'15px'}
        paddingLeft={'25px'}
        paddingRight={'15px'}
        fontSize={'16px'}
        color={'rgba(255,255,255,0.8)'}
        lineHeight={'1.2'}
        display={'flex'}
        alignContent={'flex-start'}
        // justifyContent={'flex-end'}
        gap={'15px'}
      >
        {player.twitch_stream_link && (
          <Link
            to={player.twitch_stream_link}
            target="_blank"
            rel="noopener nereferrer"
          >
            <LinkSpan
              defaultColor={linkColor}
              color={'white'}
              underlineSize="1px"
            >
              Твич
            </LinkSpan>
          </Link>
        )}
        {player.vk_stream_link && (
          <Link
            to={player.vk_stream_link}
            target="_blank"
            rel="noopener nereferrer"
          >
            <LinkSpan
              defaultColor={linkColor}
              color={'white'}
              underlineSize="1px"
            >
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
            <LinkSpan
              defaultColor={linkColor}
              color={'white'}
              underlineSize="1px"
            >
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
            <LinkSpan
              defaultColor={linkColor}
              color={'white'}
              underlineSize="1px"
            >
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
            <LinkSpan
              defaultColor={linkColor}
              color={'white'}
              underlineSize="1px"
            >
              Донейшен
            </LinkSpan>
          </Link>
        )}
      </Box>
      <Box marginTop={'15px'} paddingLeft={'15px'} paddingRight={'15px'}>
        <Link to={`/players/${player.url_handle}`}>
          <Button
            className={'player-tile-button'}
            sx={{ width: '100%' }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.6)',
              color: playerColor,
            }}
          >
            Страница стримера
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
