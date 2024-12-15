import { Box } from '@mui/material'
import { animated, useSpring } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { Color, getPlayerColor, MoveParams, Player } from 'utils/types'

import { cellSize } from '../../types'
import PlayerPopup from './PlayerPopup'
import { getMapCellById, laddersByCell, snakesByCell } from '../utils'
import { playerDisplayName } from 'src/pages/player/components/utils'
import JumpingIcon from './JumpingIcon'
import { getPlayerIcon } from './utils'

type Props = {
  player: Player
  players: Player[]
  closePopup?: boolean
  moveParams: MoveParams | null
  onAnimationEnd: (params: { player: Player; moveParams: MoveParams }) => void
  winAnimation: boolean
  animationDuration?: number
}

export default function PlayerIcon({
  player,
  players,
  closePopup,
  moveParams,
  onAnimationEnd,
  winAnimation,
  animationDuration,
}: Props) {
  const [anchorCell, setAnchorCell] = useState<HTMLElement | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const [animationState, setAnimationState] = useState<
    'start' | 'moving' | 'finish' | 'off'
  >('off')

  // console.log('move params', player.id, moveParams)

  const updateContiner = (element: HTMLDivElement) => {
    setContainer(element)
  }

  // ра// console.log('current pos', player.name, player.map_position)

  const playersOnSamePosition = players.filter(
    (p) => p.map_position === player.map_position && p.id !== player.id
  )

  const { x: relativeX, y: relativeY } = getRelativePosition(
    player,
    playersOnSamePosition
  )

  // const isAnimating = useRef(false)

  const isMoving = moveParams !== null || winAnimation

  const [springs, api] = useSpring(() => {
    return {
      from: {
        x: 0,
        y: 0,
        scale: 1,
      },
    }
  }, [])

  useEffect(() => {
    if (popupOpen) {
      setPopupOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closePopup])

  const startChainedAnimation = (moveParams: MoveParams) => {
    // console.log('Animation start', player.name, moveParams, player.map_position)

    const moves = moveParams.steps

    if (moves === 0) {
      onAnimationEnd({ player, moveParams })
      setAnimationState('finish')
      return
    }
    // isAnimating.current = true

    const backward = moves < 0
    const moveOffset = backward ? -cellSize - 1 : cellSize + 1

    const ladder = moveParams.skipLadders
      ? undefined
      : laddersByCell[player.map_position + moves]
    const snake = snakesByCell[player.map_position + moves]

    const animationsList: Array<{
      x?: number
      y?: number
      duration?: number
      scale?: number
    }> = []
    if (player.map_position === 0) {
      // console.log('moving to start', relativeX)
      // move to beginning of start area
      if (relativeX !== 0) {
        animationsList.push({
          x: -relativeX,
          // y: -relativeY,
          duration: animationDuration || Math.abs(relativeX / 100) * 800,
        })
      }
      // move to start cell
      animationsList.push({ x: -relativeX - moveOffset })
    }

    let currentX = animationsList[animationsList.length - 1]?.x || 0
    let currentY = animationsList[animationsList.length - 1]?.y || 0
    let halfTurn = 0
    for (let i = 0; i < Math.abs(moves); i++) {
      const nextCell = backward
        ? getMapCellById(player.map_position - i - 1)
        : getMapCellById(player.map_position + i)
      // console.log("next cell", { nextCell }, player.mapPosition, i);

      if (!nextCell) {
        continue
      }

      // console.log('next x', currentX, nextCell.direction)

      // console.log({ nextCell, currentLocation, position: player.mapPosition });
      switch (nextCell.direction) {
        case 'right':
          currentX += moveOffset
          animationsList.push({
            x: currentX,
            y: currentY,
          })
          break
        case 'left':
          currentX -= moveOffset
          animationsList.push({
            x: currentX,
            y: currentY,
          })
          break
        case 'up':
          currentY -= moveOffset
          animationsList.push({
            y: currentY,
            x: currentX,
            scale: 1.0,
          })
          break
      }
    }

    if (ladder) {
      const ladderAnimation = calculateAnimation(
        player.map_position,
        ladder.cellTo
      )
      if (player.map_position === 0) {
        const adjustedForStart = {
          x: ladderAnimation.x - relativeX - moveOffset,
          y: ladderAnimation.y - moveOffset,
        }
        animationsList.push(adjustedForStart)
      } else {
        animationsList.push(ladderAnimation)
      }
    }

    if (snake) {
      animationsList.push(calculateAnimation(player.map_position, snake.cellTo))
    }

    console.log('animations list', animationsList, player.name)

    // const animationConfig = {
    //   easing: (t: number) => t,
    //   duration: 1000,
    //   // velocity: 1,
    // }

    // api.stop()
    api.set({ x: 0, y: 0 })

    api.start({
      from: { x: 0, y: 0 },
      to: async (next) => {
        for (let i = 0; i < animationsList.length; i++) {
          const nextAnimation = animationsList[i]

          // console.log('animation start', animationsList[i])
          await next({
            x: nextAnimation.x,
            y: nextAnimation.y,
            scale: nextAnimation.scale || 1,
            config: {
              // ...animationConfig,
              duration: animationDuration || animationsList[i].duration || 1000,
            },
          })
        }
      },
      onRest: () => {
        // isAnimating.current = false
        onAnimationEnd({ player, moveParams })
        setAnimationState('finish')
        // api.stop()
      },
    })
  }

  useEffect(() => {
    if (
      animationState === 'start' &&
      !winAnimation &&
      moveParams
      // && !isAnimating.current
    ) {
      if (anchorCell) {
        window.scrollTo({
          top: anchorCell.offsetTop - window.innerHeight / 2 + 100,
          behavior: 'smooth',
        })
      }
      setAnimationState('moving')
      startChainedAnimation(moveParams)
    }
    // console.log('is moving before stop', isMoving)
    if (!isMoving) {
      // console.log('flag stop')
      api.stop()
      setAnimationState('off')
      // api.set({ x: 0, y: 0 })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationState, moveParams, winAnimation])

  useEffect(() => {
    if (anchorCell) {
      // console.log(
      //   'Updating Spring API',
      //   player.name,
      //   player.map_position,
      //   anchorCell,
      //   animationState
      // )
      if (animationState !== 'finish' && animationState !== 'moving') {
        api.set({ x: 0, y: 0 })
        api.start({
          from: { x: 0, y: 0, scale: 1 },
          to: { x: 0, y: 0, scale: 1 },
        })
      }
      const targetCellId =
        moveParams?.cellFrom === 0
          ? 'map-cell-start'
          : `map-cell-${player.map_position}`

      if (
        isMoving &&
        moveParams?.cellFrom !== undefined &&
        anchorCell.id === targetCellId &&
        animationState !== 'moving'
      ) {
        setAnimationState('start')
      }
    }
  }, [anchorCell, api, player.map_position, isMoving, moveParams])

  const startWinAnimation = () => {
    if (!anchorCell) {
      return
    }

    const mapContainer = document.getElementById('map-container')
    if (!mapContainer) {
      return
    }

    setAnimationState('moving')

    const mapContainerLeft = mapContainer.offsetLeft

    const targetX = 392
    const targetY = 240

    const originTop = anchorCell.offsetTop + 30
    const originLeft = anchorCell.offsetLeft + 55

    const currentX = originLeft + relativeX
    const currentY = originTop + relativeY

    const deltaX = targetX - currentX + mapContainerLeft
    const deltaY = targetY - currentY

    api.start({
      from: { x: 0, y: 0 },
      to: async (next) => {
        await next({ x: deltaX, y: deltaY })
      },
      onRest: () => {
        onAnimationEnd({ player, moveParams: { steps: 1, skipLadders: false } })
      },
      config: { duration: 5000 },
    })
  }

  useEffect(() => {
    if (winAnimation) {
      startWinAnimation()
    }
  }, [winAnimation])

  useEffect(() => {
    // console.log('updating map position to', player.map_position, player.name)

    const cellId =
      player.map_position > 0
        ? `map-cell-${player.map_position}`
        : 'map-cell-start'

    const findCell = document.getElementById(cellId)
    if (findCell) {
      setAnchorCell(findCell)
      if (isMoving && moveParams?.cellFrom === undefined) {
        setAnimationState('start')
      }
      if (animationState === 'finish') {
        setAnimationState('off')
      }
    } else {
      const interval = setInterval(() => {
        const findCell = document.getElementById(cellId)
        setAnchorCell(findCell)
        // if (isMoving) {
        //   setAnimationState('start')
        // }
        clearInterval(interval)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [player.map_position, isMoving, moveParams])

  // console.log({ player, cell });
  if (!anchorCell) {
    return null
  }

  const originTop = anchorCell.offsetTop + 30
  const originLeft = anchorCell.offsetLeft + 55

  const positionTop = originTop + relativeY
  const positionLeft = originLeft + relativeX

  let finalPositionTop = positionTop
  let finalPositionLeft = positionLeft

  const containerWidth = container?.offsetWidth
  if (containerWidth) {
    finalPositionLeft = positionLeft - containerWidth / 2
  }

  if (isMoving) {
    // adjust height for animation
    finalPositionTop = positionTop - 14
  }

  const handleClick = (event: React.MouseEvent) => {
    setPopupAnchor(event.currentTarget as HTMLElement)
    setPopupOpen(!popupOpen)
    event.stopPropagation()
  }

  const playerColor = getPlayerColor(player.url_handle)
  const playerIcon = getPlayerIcon(player.url_handle)

  const hideAvatar =
    playersOnSamePosition.length > 1 && player.map_position !== 0 && !isMoving

  const onPopupClick = (event: React.MouseEvent) => {
    setPopupOpen(false)
    event.stopPropagation()
  }

  const displayName = playerDisplayName(player)

  return (
    <animated.div
      style={{
        position: 'absolute',
        top: finalPositionTop,
        left: finalPositionLeft,
        ...springs,
      }}
    >
      <Box position="relative">
        <PlayerPopup
          open={popupOpen}
          player={player}
          anchorEl={popupAnchor}
          onClick={onPopupClick}
        />
        <Box
          onClick={handleClick}
          style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}
          ref={updateContiner}
        >
          {!hideAvatar && (
            <JumpingIcon
              image={playerIcon}
              isJumping={
                animationState === 'moving' || animationState === 'start'
              }
            />
          )}
          <p style={{ padding: 0, margin: 0, lineHeight: 1 }}>
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
                // border: '1px solid white',

                display: 'flex',
                alignItems: 'center',
                paddingTop: '3px',
                paddingBottom: '3px',
                zIndex: 25,
                position: 'relative',
                boxShadow:
                  '0px 6px 12px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.08)',
              }}
            >
              {displayName}
            </span>
          </p>
        </Box>
      </Box>
    </animated.div>
  )
}

function calculateAnimation(mapPosition: number, cellTo: number) {
  const targetRow = Math.floor((cellTo - 1) / 10)
  const targetColumn =
    targetRow % 2 === 0 ? (cellTo - 1) % 10 : 10 - (cellTo % 10 || 10)

  let originRow = Math.floor((mapPosition - 1) / 10)
  if (originRow < 0) {
    originRow = 0
  }

  let originColumn =
    originRow % 2 === 0 ? (mapPosition - 1) % 10 : 10 - (mapPosition % 10 || 10)
  if (originColumn < 0) {
    originColumn = 0
  }

  const moveOffset = cellSize + 1

  return {
    x: (targetColumn - originColumn) * moveOffset,
    y: -(targetRow - originRow) * moveOffset,
  }
}

function getRelativePosition(player: Player, players: Player[]) {
  if (players.length === 0) {
    return { x: 0, y: 0 }
  }

  const sortedPlayers = [player, ...players].sort((a, b) => a.id - b.id)
  const playerIndex = sortedPlayers.findIndex((p) => p.id === player.id)

  if (player.map_position === 0) {
    return { x: playerIndex * 100, y: 0 }
  }
  if (sortedPlayers.length === 2) {
    return { x: -50 * playerIndex + 30, y: playerIndex * 25 - 30 }
  }
  if (sortedPlayers.length === 3) {
    return { x: 15, y: playerIndex * 30 - 10 }
  }
  return { x: 20, y: playerIndex * 25 - 10 }
}
