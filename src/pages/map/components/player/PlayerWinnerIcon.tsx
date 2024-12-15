import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { Color, getPlayerColor, Player } from 'utils/types'

import PlayerPopup from './PlayerPopup'
import JumpingIcon from './JumpingIcon'
import { getPlayerIcon } from './utils'

type Props = {
  player: Player
  closePopup?: boolean
  isMoving?: boolean
  position: 1 | 2 | 3
}

export default function PlayerWinnerIcon({
  player,
  closePopup,
  isMoving,
  position,
}: Props) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (popupOpen) {
      setPopupOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closePopup])

  const updateContainer = (element: HTMLDivElement) => {
    setContainer(element)
  }

  const mapContainer = document.getElementById('map-container')
  if (!mapContainer) {
    return
  }

  const mapContainerLeft = mapContainer.offsetLeft

  const positionToCoordsMap = {
    1: { top: 180, left: 392, scale: 1.5 },
    2: { top: 235, left: 582, scale: 1.2 },
    3: { top: 300, left: 705, scale: 1.1 },
  }

  const coords = positionToCoordsMap[position]

  const containerWidth = container?.offsetWidth
  let adjustedLeft = coords.left + mapContainerLeft
  if (containerWidth) {
    adjustedLeft = adjustedLeft - containerWidth / 2
  }

  const handleClick = (event: React.MouseEvent) => {
    setPopupAnchor(event.currentTarget as HTMLElement)
    setPopupOpen(!popupOpen)
    event.stopPropagation()
  }

  const onlineColor = player.is_online ? Color.green : Color.red
  const playerColor = getPlayerColor(player.url_handle)
  const playerIcon = getPlayerIcon(player.url_handle)

  return (
    <Box
      style={{
        position: 'absolute',
        top: coords.top,
        left: adjustedLeft,
        zIndex: 10,
      }}
    >
      <Box position="relative">
        <PlayerPopup
          open={popupOpen}
          player={player}
          anchorEl={popupAnchor}
          onClick={() => setPopupOpen(false)}
        />
        <Box
          onClick={handleClick}
          style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}
          ref={updateContainer}
        >
          <JumpingIcon
            image={playerIcon}
            isJumping={isMoving}
            scale={coords.scale}
          />
          <p
            style={{
              padding: 0,
              margin: 0,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                height: '23px',
                color: 'white',
                lineHeight: 1,
                backgroundColor: player.is_online
                  ? playerColor
                  : Color.greyLight,
                paddingLeft: '5px',
                paddingRight: '5px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '3px',
                paddingBottom: '3px',
              }}
            >
              {player.name}
            </span>
          </p>
        </Box>
      </Box>
    </Box>
  )
}
