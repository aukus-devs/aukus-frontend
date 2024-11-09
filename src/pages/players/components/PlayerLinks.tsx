import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import LinkSpan from 'src/components/LinkSpan'
import { Color, Player } from 'src/utils/types'

type Props = {
  player: Player
}

export default function PlayerLinks({ player }: Props) {
  const linksMargin = '30px'
  return (
    <Box
      margin={'auto'}
      marginTop={'20px'}
      marginLeft={'20px'}
      display={'flex'}
      justifyContent={'start'}
      width={'fit-content'}
    >
      {player.twitch_stream_link && (
        <Box>
          <Link
            to={player.twitch_stream_link}
            target="_blank"
            rel="noopener nereferrer"
            style={{ marginRight: linksMargin }}
          >
            <LinkSpan color={Color.purple} style={{ fontSize: '20px' }}>
              Twitch
            </LinkSpan>
          </Link>
        </Box>
      )}
      {player.vk_stream_link && (
        <Link
          to={player.vk_stream_link}
          target="_blank"
          rel="noopener nereferrer"
          style={{ marginRight: linksMargin }}
        >
          <LinkSpan color={Color.blue} style={{ fontSize: '20px' }}>
            VKPlay
          </LinkSpan>
        </Link>
      )}
      {player.telegram_link && (
        <Link
          to={player.telegram_link}
          target="_blank"
          rel="noopener nereferrer"
          style={{ marginRight: linksMargin }}
        >
          <LinkSpan color={Color.blueTg} style={{ fontSize: '20px' }}>
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
          <LinkSpan color={Color.orange} style={{ fontSize: '20px' }}>
            Донейшен
          </LinkSpan>
        </Link>
      )}
    </Box>
  )
}