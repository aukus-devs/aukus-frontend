import { Paper, Popper, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import LinkSpan from 'components/LinkSpan'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { playerDisplayName } from 'src/pages/player/components/utils'
import { Color, getPlayerColor, Player } from 'utils/types'

type Props = {
  player: Player
  open: boolean
  onClick: (event: React.MouseEvent) => void
  anchorEl: HTMLElement | null
}

export default function PlayerPopup({
  player,
  open,
  onClick,
  anchorEl,
}: Props) {
  const [topPosition, setTopPosition] = useState(0)
  const [leftPosition, setLeftPosition] = useState(0)
  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null)

  const anchorRect = anchorEl?.getBoundingClientRect()

  useEffect(() => {
    if (anchorEl && anchorRect) {
      let top = anchorRect.top + window.scrollY
      if (popupRef) {
        top = top - popupRef.clientHeight - 10
      } else {
        top = top - 150
      }

      // console.log(top, topPosition)

      if (topPosition > top || topPosition === 0) {
        setTopPosition(top)
      }
      if (leftPosition === 0) {
        setLeftPosition(anchorRect.left + anchorRect.width / 2 - 125)
      }
    }
  }, [anchorEl, anchorRect, topPosition, leftPosition, popupRef])

  if (!anchorEl) {
    return null
  }

  // console.log(anchorEl.offsetTop, anchorEl.offsetHeight, anchorRect)

  return (
    <Popper
      ref={(node) => setPopupRef(node)}
      open={open}
      anchorEl={anchorEl}
      transition
      style={{
        position: 'absolute',
        top: topPosition,
        left: leftPosition,
        width: '250px',
        zIndex: 99,
      }}
      onClick={onClick}
    >
      <Paper
        style={{
          borderRadius: '15px',
          padding: '15px',
          background: '#161616',
        }}
      >
        <Box>
          <Typography fontSize={'16px'} fontWeight={700}>
            <Link to={`/players/${player.url_handle}`}>
              <LinkSpan color={getPlayerColor(player.url_handle)}>
                {playerDisplayName(player)}
              </LinkSpan>
            </Link>
          </Typography>
          <Box
            color={'#FFFFFFCC'}
            marginTop={'8px'}
            marginBottom={'20px'}
            fontSize={'14px'}
            fontWeight={500}
          >
            Игра: {player.current_game}
          </Box>
          {player.is_online ? (
            <Box fontSize={'14px'} fontWeight={600}>
              <Link
                to={
                  player.twitch_stream_link ||
                  player.kick_stream_link ||
                  player.vk_stream_link
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip title={player.stream_last_category}>
                  <LinkSpan color={Color.green}>Смотреть</LinkSpan>
                </Tooltip>
              </Link>
            </Box>
          ) : (
            <Box fontSize={'14px'} fontWeight={600}>
              Офлайн
            </Box>
          )}
        </Box>
      </Paper>
    </Popper>
  )
}
