import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Color, getPlayerColorName, Player } from 'utils/types'
import OpenIcon from 'assets/open_icon.svg'
import LinkSpan from 'src/components/LinkSpan'

type Props = {
  player: Player
}

export default function StreamLink({ player }: Props) {
  const isKick = player.kick_stream_link?.length > 0
  const showOnline = player.is_online
  return (
    <Link
      to={
        player.twitch_stream_link ||
        player.kick_stream_link ||
        player.vk_stream_link
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {showOnline ? (
        <OnlineButton player={player} />
      ) : (
        <OfflineButton player={player} />
      )}
    </Link>
  )
}

function OnlineButton({ player }: Props) {
  return (
    <Button
      sx={{
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '50px',
        paddingRight: '50px',
        lineHeight: '1',
      }}
      color={getPlayerColorName(player)}
    >
      <Box display="flex" alignItems={'center'} fontSize={'14px'}>
        Смотреть: {player.stream_last_category}
        <img
          src={OpenIcon}
          alt=""
          style={{ marginLeft: '10px', width: '17px', height: '17px' }}
        />
      </Box>
    </Button>
  )
}

function OfflineButton({ player }: Props) {
  return (
    <Button
      sx={{
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '50px',
        paddingRight: '50px',
        lineHeight: '1',
      }}
      style={{
        fontSize: '14px',
        borderWidth: '2px',
      }}
      color={'customGreyDark'}
      variant="contained"
    >
      <Box display="flex" alignItems={'center'}>
        Стример оффлайн
        <img
          src={OpenIcon}
          alt=""
          style={{ marginLeft: '10px', width: '17px', height: '17px' }}
        />
      </Box>
    </Button>
  )
}
