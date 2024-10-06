import { Paper, Popper, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import LinkSpan from 'components/LinkSpan'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Color, getPlayerColor, Player } from 'utils/types'

type Props = {
  player: Player
  open: boolean
  close: () => void
  anchorEl: HTMLElement | null
}

export default function PlayerPopup({ player, open, close, anchorEl }: Props) {
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
      }}
      onClick={close}
    >
      <Paper
        style={{
          borderRadius: '15px',
          padding: '15px',
          background: Color.greyLight,
        }}
      >
        <Box>
          <Typography fontSize={'16px'} fontWeight={700}>
            <Link to={`/players/${player.url_handle}`}>
              <LinkSpan color={getPlayerColor(player.url_handle)}>
                {player.name}
              </LinkSpan>
            </Link>
          </Typography>
          <Box marginTop={'8px'} marginBottom={'20px'}>
            <Typography fontSize={'14px'} fontWeight={500}>
              Игра: {player.current_game}
            </Typography>
          </Box>
          {player.is_online ? (
            <Typography fontSize={'14px'} fontWeight={600}>
              <Link
                to={player.twitch_stream_link || player.vk_stream_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip title={player.stream_last_category}>
                  <LinkSpan color={Color.green}>Смотреть</LinkSpan>
                </Tooltip>
              </Link>
            </Typography>
          ) : (
            <Typography fontSize={'14px'} fontWeight={600}>
              Офлайн
            </Typography>
          )}
        </Box>
      </Paper>
    </Popper>
  )
}