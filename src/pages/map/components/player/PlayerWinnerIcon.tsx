import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Color, getPlayerColor, Player } from 'utils/types'
import PlayerGreen from 'assets/map/optimized/PlayerGreen.webp'
import PlayerRed from 'assets/map/optimized/PlayerRed.webp'
import PlayerBlue from 'assets/map/optimized/PlayerBlue.webp'
import PlayerBlueLight from 'assets/map/optimized/PlayerBlueLight.webp'
import PlayerBlueDark from 'assets/map/optimized/PlayerBlueDark.webp'
import PlayerBrown from 'assets/map/optimized/PlayerBrown.webp'
import PlayerPink from 'assets/map/optimized/PlayerPink.webp'
import PlayerPinkLight from 'assets/map/optimized/PlayerPinkLight.webp'
import PlayerOrange from 'assets/map/optimized/PlayerOrange.webp'
import PlayerPurple from 'assets/map/optimized/PlayerPurple.webp'

import PlayerPurpleMoving from 'assets/map/PlayerPurpleMoving.gif'
import PlayerOrangeMoving from 'assets/map/PlayerOrangeMoving.gif'
import PlayerPinkMoving from 'assets/map/PlayerPinkMoving.gif'
import PlayerPinkLightMoving from 'assets/map/PlayerPinkLightMoving.gif'
import PlayerRedMoving from 'assets/map/PlayerRedMoving.gif'
import PlayerBlueMoving from 'assets/map/PlayerBlueMoving.gif'
import PlayerBlueLightMoving from 'assets/map/PlayerBlueLightMoving.gif'
import PlayerBlueDarkMoving from 'assets/map/PlayerBlueDarkMoving.gif'
import PlayerGreenMoving from 'assets/map/PlayerGreenMoving.gif'
import PlayerBrownMoving from 'assets/map/PlayerBrownMoving.gif'

import { cellSize } from '../../types'
import PlayerPopup from './PlayerPopup'
import { getMapCellById, laddersByCell, snakesByCell } from '../utils'

const playerIcons: { [key: string]: string } = {
  lasqa: PlayerBlue,
  praden: PlayerBrown,
  predan: PlayerBrown,
  roadhouse: PlayerPurple,
  segall: PlayerOrange,
  artur: PlayerRed,
  uselessmouth: PlayerPink,
  unclobjorn: PlayerBlueDark,
  melharucos: PlayerBlueLight,
  browjey: PlayerGreen,
  f1ashko: PlayerPinkLight,
}

const playerMovingIcons: { [key: string]: string } = {
  lasqa: PlayerBlueMoving,
  praden: PlayerBrownMoving,
  predan: PlayerBrownMoving,
  roadhouse: PlayerPurpleMoving,
  segall: PlayerOrangeMoving,
  artur: PlayerRedMoving,
  uselessmouth: PlayerPinkMoving,
  unclobjorn: PlayerBlueDarkMoving,
  melharucos: PlayerBlueLightMoving,
  browjey: PlayerGreenMoving,
  f1ashko: PlayerPinkLightMoving,
}

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
  const iconRef = useRef<HTMLImageElement>(null)
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
  const playerIcon = isMoving
    ? playerMovingIcons[player.url_handle] || PlayerBlueLightMoving
    : playerIcons[player.url_handle] || PlayerBlueLight

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
          <img
            ref={iconRef}
            src={playerIcon}
            width={`${40 * coords.scale}px`}
            alt=""
            style={{ verticalAlign: 'middle' }}
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
