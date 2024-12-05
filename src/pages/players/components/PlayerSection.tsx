import { Box, Button } from '@mui/material'
import LinkSpan from 'components/LinkSpan'
import { Link } from 'react-router-dom'
import { Color, getPlayerColorName, Player } from 'utils/types'
import { PlayerPhotoMap } from './utils'
import useScreenSize from 'src/context/useScreenSize'
import PlayerLinks from './PlayerLinks'
import PlayerSectionMobile from './PlayerSectionMobile'
import { playerDisplayName } from 'src/pages/player/components/utils'

type Props = {
  player: Player
}

export default function PlayerSection({ player }: Props) {
  const photo = PlayerPhotoMap[player.url_handle]
  const { isMobile } = useScreenSize()

  if (isMobile) {
    return <PlayerSectionMobile player={player} />
  }

  const displayName = playerDisplayName(player)

  return (
    <Box
      display="flex"
      justifyContent="start"
      margin={'auto'}
      width={'fit-content'}
    >
      <Box textAlign={'left'} width={'550px'}>
        <Box fontSize={'48px'} fontWeight={700} lineHeight={1.2}>
          {player.first_name || ''} «{displayName}»
        </Box>
        <Box
          // height={'340px'}
          width={'550px'}
          margin={'auto'}
          marginTop={'30px'}
          marginBottom={'0px'}
        >
          {photo && (
            <img
              src={photo}
              // height="340px"
              width={'550px'}
              alt="player pic"
              style={{ borderRadius: '15px' }}
            />
          )}
        </Box>
        <PlayerLinks player={player} />
        <Box textAlign="center" marginTop={'30px'} width="100%">
          <Link to={`/players/${player.url_handle}`}>
            <Button
              variant="contained"
              fullWidth
              color={getPlayerColorName(player)}
              sx={{
                height: '50px',
                width: '550px',
              }}
              style={{ borderRadius: '15px' }}
            >
              Страница участника
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
