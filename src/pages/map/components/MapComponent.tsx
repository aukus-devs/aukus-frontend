import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from 'context/UserProvider'
import useScreenSize from 'context/useScreenSize'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { createPlayerMove, fetchPlayers, fetchStats } from 'utils/api'
import CrownIcon from 'assets/icons/crown.svg?react'
import {
  Color,
  getPlayerColor,
  MoveParams,
  NextTurnParams,
  Player,
} from 'utils/types'
import { useTimelapse } from '../hooks/useTimelapse'
import { cellSize, MainMap } from '../types'
import ActionButton from './action/ActionButton'
import CellItem from './CellItem'
import MapArrow from './MapArrow'
import PlayerIcon from './player/PlayerIcon'
import StaticPanel from './StaticPanel'
import SVGMarkers from './SVGMarkers'
import TesterButton from './TesterButton'
import TimelapseButton from './timelapse/TimelapseButton'
import TodaysMoves from './TodaysMoves'
import {
  ladders,
  laddersByCell,
  lastCell,
  mapCellRows,
  mapCellsSorted,
  snakes,
  snakesByCell,
  startCell,
} from './utils'
import LinkSpan from 'src/components/LinkSpan'
import { getPlayerScore } from 'src/pages/stats/components/Leaderboard'
import PlayerWinnerIcon from './player/PlayerWinnerIcon'
import { Link } from 'react-router-dom'
import useLocalStorage from 'src/context/useLocalStorage'
import { getEventTimeLeft } from 'src/pages/rules/components/Countdown'

export default function MapComponent() {
  const [closePopups, setClosePopups] = useState(false)
  // const [moveSteps, setMoveSteps] = useState(0)

  const [moveParams, setMoveParams] = useState<MoveParams | null>(null)

  const [makingTurn, setMakingTurn] = useState(false)
  const [startWinAnimation, setStartWinAnimation] = useState(false)

  const { save, load } = useLocalStorage()
  const showArrows = load('showArrows', true)

  const [frozenDice, setFrozenDice] = useState<number | null>(null)

  const timelapseState = useTimelapse()
  const timelapseEnabled = timelapseState.state !== 'closed'

  const queryClient = useQueryClient()

  const [timeLeft, setTimeLeft] = useState(() => getEventTimeLeft())

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const mapWidth = 1715
    const diff = mapWidth - window.innerWidth
    if (diff > 0) {
      window.scrollTo({ left: diff / 2, behavior: 'smooth' })
    }
  }, [])

  const fireworksRef = useRef<FireworksHandlers>(null)

  const disableFireworks = () => {
    if (fireworksRef.current) {
      fireworksRef.current.stop()
    }
  }

  const enableFireworks = () => {
    if (fireworksRef.current) {
      fireworksRef.current.start()
    }
  }

  const toggleFireworks = () => {
    if (!fireworksRef.current) {
      return
    }
    if (fireworksRef.current.isRunning) {
      fireworksRef.current.stop()
    } else {
      fireworksRef.current.start()
    }
  }

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    refetchInterval: 1000 * 30,
    enabled: !makingTurn,
  })

  let players = playersData?.players || []
  if (timelapseEnabled) {
    players = timelapseState.players
  }

  const playerWithMaxPosition =
    players.length > 0
      ? players.reduce((prev, current) =>
          prev.map_position > current.map_position ? prev : current
        )
      : null

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = getEventTimeLeft()
      setTimeLeft(difference)
    }, 1000)

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  const deadlineReached = timeLeft <= 0
  const showCountdown = timeLeft <= 1000 * 60 * 60 * 24

  const timerText = formatSeconds(timeLeft)

  const winnerFound =
    !timelapseEnabled &&
    playerWithMaxPosition &&
    playerWithMaxPosition.map_position > 101

  const { data: playerStats } = useQuery({
    queryKey: ['playersStats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 1,
    enabled: !!(winnerFound || deadlineReached),
  })
  const playersStats = playerStats?.players || []

  let top3players: Player[] = []
  // const top3players: Player[] = players.slice(0, 3)
  if (winnerFound && playersStats.length > 2) {
    top3players.push(playerWithMaxPosition)
    const statsByScore = playersStats
      .filter((player) => player.id !== playerWithMaxPosition.id)
      .sort((a, b) => getPlayerScore(b) - getPlayerScore(a))

    const top2players = statsByScore
      .slice(0, 2) // Get the top 3 player stats
      .map((stat) => players.find((player) => player.id === stat.id)) // Map to player objects
      .filter((player): player is Player => !!player) // Filter out any undefined results

    top3players = [playerWithMaxPosition, ...top2players]
  }

  if (deadlineReached && playersStats.length > 2) {
    const statsByScore = playersStats.sort(
      (a, b) => getPlayerScore(b) - getPlayerScore(a)
    )
    top3players = statsByScore
      .slice(0, 3) // Get the top 3 player stats
      .map((stat) => players.find((player) => player.id === stat.id)) // Map to player objects
      .filter((player): player is Player => !!player) // Filter out any undefined results
  }

  const showWinScreen = top3players.length > 0

  useEffect(() => {
    if (showWinScreen && !fireworksRef.current?.isRunning) {
      enableFireworks()
    }
    if (!showWinScreen) {
      disableFireworks()
    }
  }, [showWinScreen])

  const currentUser = useUser()
  useScreenSize({ updateOnResize: true })

  const currentPlayer = players?.find(
    (player) => player.id === currentUser?.user_id
  )

  const makeMove = useMutation({
    mutationFn: createPlayerMove,
  })

  const map: MainMap = {
    cellRows: mapCellRows,
    cells: mapCellsSorted,
    startCell,
    finishCell: lastCell,
  }

  const handleClick = () => {
    setClosePopups(!closePopups)
    save('showArrows', !showArrows)
  }

  const handleMakingTurn = (value: boolean) => {
    setMakingTurn(value)
  }

  const handleDiceRoll = (params: NextTurnParams) => {
    if (!currentPlayer) {
      return
    }

    const diceRoll = frozenDice || params.diceRoll
    if (currentPlayer.map_position === 101 && params.type === 'completed') {
      // win condition
      return
    }

    const skipLadders = params.itemLength === 'tiny'

    const newPosition = getNextPlayerPosition({
      player: currentPlayer,
      moves: diceRoll,
      skipLadders,
    })
    // console.log(
    //   'current position',
    //   currentPlayer.map_position,
    //   'to',
    //   newPosition,
    //   'dice roll',
    //   diceRoll
    // )

    // save player position in API
    makeMove.mutate({
      player_id: currentPlayer.id,
      dice_roll: diceRoll,
      move_to: newPosition,
      stair_from: params.stairFrom,
      stair_to: params.stairTo,
      snake_from: params.snakeFrom,
      snake_to: params.snakeTo,
      type: params.type,
      item_title: params.itemTitle,
      item_length: params.itemLength,
      item_rating: params.itemRating,
      item_review: params.itemReview,
    })
  }

  const handleNextTurn = (params: NextTurnParams) => {
    if (!currentPlayer) {
      return
    }

    const diceRoll = frozenDice || params.diceRoll

    if (currentPlayer.map_position === 101 && params.type === 'completed') {
      // win condition
      const newPosition = 102
      makeMove.mutate(
        {
          player_id: currentPlayer.id,
          dice_roll: 1,
          move_to: newPosition,
          stair_from: null,
          stair_to: null,
          snake_from: null,
          snake_to: null,
          type: params.type,
          item_title: params.itemTitle,
          item_length: params.itemLength,
          item_rating: params.itemRating,
          item_review: params.itemReview,
        }
        // {
        //   onSettled: () => {
        //     queryClient.invalidateQueries({ queryKey: ['players'] })
        //   },
        // }
      )
      setStartWinAnimation(true)
      setMakingTurn(true)
      return
    }

    const steps = getMoveSteps(currentPlayer, diceRoll)
    // setMoveSteps(steps)
    setMoveParams({ steps, skipLadders: params.itemLength === 'tiny' })
  }

  const handleAnimationEnd = (player: Player, params: MoveParams) => {
    if (player.id !== currentPlayer?.id) {
      return
    }
    // const newPosition = getNextPlayerPosition({
    //   player,
    //   moves: params.steps,
    //   skipLadders: params.skipLadders,
    // })
    // player.map_position = newPosition
    // setMoveSteps(0)
    setMoveParams(null)
    setMakingTurn(false)
    setStartWinAnimation(false)
    queryClient.invalidateQueries({ queryKey: ['players'] })
  }

  const animating = startWinAnimation || moveParams !== null

  const stopActions = showWinScreen || animating
  const showActionButton = currentPlayer && !timelapseEnabled && !stopActions
  const showBigTimelapse = !showActionButton && !timelapseEnabled && !animating

  const showTestButton = currentPlayer && !timelapseEnabled && false

  const winner = top3players[0] ?? null

  return (
    <Box
      style={{
        overflowX: 'auto',
        // width: '1214px',
        // minWidth: '1214px',
        // maxWidth: '1214px',
      }}
      onClick={handleClick}
    >
      <SVGMarkers />
      <Fireworks
        ref={fireworksRef}
        options={{ opacity: 0.5, explosion: 8, intensity: 45, particles: 105 }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '700px',
          position: 'absolute',
          zIndex: 2,
        }}
      />

      {showWinScreen && winner && (
        <Box display={'flex'} justifyContent={'center'}>
          <Box
            fontSize={'20px'}
            textAlign={'center'}
            style={{
              backgroundColor: getPlayerColor(winner.url_handle),
              borderRadius: '10px',
              zIndex: 10,
              position: 'relative',
            }}
            width={'740px'}
            height={'44px'}
            padding={'10px'}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
            >
              <CrownIcon
                width={'24px'}
                height={'24px'}
                style={{ marginRight: '10px' }}
              />
              <Box>
                Можете выдыхать, ивент закончен{' — '}
                <Link to={`/players/${winner.url_handle}`}>
                  <LinkSpan color={'white'}>{winner.name}</LinkSpan>{' '}
                </Link>
                победил!
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {showCountdown && !showWinScreen && (
        <Box display={'flex'} justifyContent={'center'}>
          <Box
            fontSize={'20px'}
            textAlign={'center'}
            style={{
              backgroundColor: Color.greyLight,
              borderRadius: '10px',
              zIndex: 10,
              position: 'relative',
            }}
            width={'740px'}
            height={'44px'}
            padding={'10px'}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
            >
              <Box>
                До конца ивента{' — '}
                <span className={'mono'}>{timerText}</span>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {!showWinScreen && !showCountdown && <Box height={'44px'} />}

      <Box display={'flex'} justifyContent={'center'}>
        <Box
          id="map-container"
          style={{
            width: '1715px',
            height: '2146px',
            backgroundImage: "url('uploads/aukus_map_compressed.png')",
            backgroundRepeat:
              'no-repeat' /* Prevent the image from repeating */,
            backgroundPosition: 'center' /* Center the image */,
            opacity: darkMode ? 0.6 : 1.0,
          }}
        >
          {showWinScreen && top3players.length > 2 && (
            <>
              <PlayerWinnerIcon
                player={top3players[0]}
                position={1}
                isMoving
                closePopup={closePopups}
              />
              <PlayerWinnerIcon
                player={top3players[1]}
                position={2}
                closePopup={closePopups}
              />
              <PlayerWinnerIcon
                player={top3players[2]}
                position={3}
                closePopup={closePopups}
              />
            </>
          )}

          <Grid
            container
            justifyContent={'center'}
            columns={11}
            width={'auto'}
            style={{
              backgroundSize: 'cover',
              borderRadius: '15px',
              marginTop: '300px',
            }}
          >
            <Grid container columns={10} width={'auto'}>
              <Grid item>
                <Box width={(cellSize + 1) * 10} height={cellSize} />
              </Grid>
            </Grid>
            <Grid container columns={10} width={'auto'}>
              <Grid item>
                <CellItem
                  cell={lastCell}
                  currentPlayer={currentPlayer}
                  moveSteps={moveParams?.steps}
                />
              </Grid>
              <Grid item>
                <Box width={(cellSize + 1) * 9} height={cellSize} />
              </Grid>
            </Grid>
            {map.cellRows.map((row, index) => (
              <Grid container key={index} columns={10} width={'auto'}>
                {row.map((cell) => (
                  <Grid
                    item
                    key={cell.id}
                    sx={{
                      borderRight: '1px solid transparent',
                      borderBottom: index === 9 ? '1px solid transparent' : 0,
                      borderTop: '1px solid transparent',
                    }}
                  >
                    <CellItem
                      cell={cell}
                      currentPlayer={currentPlayer}
                      moveSteps={moveParams?.steps}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
            <Grid container columns={10} width={'auto'}>
              <Grid item>
                <CellItem cell={startCell} />
              </Grid>

              <Grid item>
                <Box
                  width={(cellSize + 1) * 9}
                  height={cellSize}
                  id={'map-cell-start'}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {ladders.map((ladder) => (
        <Fragment key={ladder.cellFrom}>
          <MapArrow
            from={ladder.cellFrom}
            to={ladder.cellTo}
            hide={!showArrows}
          />
        </Fragment>
      ))}
      {snakes.map((snake) => (
        <Fragment key={snake.cellFrom}>
          <MapArrow
            from={snake.cellFrom}
            to={snake.cellTo}
            hide={!showArrows}
          />
        </Fragment>
      ))}

      {players &&
        players.map((player) => (
          <PlayerIcon
            key={player.id}
            player={player}
            players={players}
            closePopup={closePopups}
            moveParams={player.id === currentPlayer?.id ? moveParams : null}
            onAnimationEnd={handleAnimationEnd}
            winAnimation={
              player.id === currentPlayer?.id ? startWinAnimation : false
            }
          />
        ))}
      <StaticPanel>
        <Box display="flex" justifyContent="center" width={'100%'}>
          {showActionButton && (
            <Box textAlign="center" width="100%" position={'relative'}>
              <Box
                sx={{
                  position: 'relative',
                  width: '320px',
                  display: 'inline-block',
                }}
                marginRight={'10px'}
                textAlign="center"
              >
                <Box
                  position="absolute"
                  width="200px"
                  display="inline"
                  left={'-193px'}
                >
                  <Button
                    sx={{ height: '44px' }}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    Затемнить карту
                  </Button>
                </Box>
                {/* <Box
                  position="absolute"
                  left={'-155px'}
                  width="fit-content"
                  display="inline"
                  style={{
                    background: Color.blue,
                    borderRadius: '10px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    height: '44px',
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showArrows}
                          onChange={(val) => setShowArrows(val.target.checked)}
                          color="customWhite"
                        />
                      }
                      label="Стрелки"
                    />
                  </FormGroup>
                </Box> */}
                <ActionButton
                  handleNextTurn={handleNextTurn}
                  player={currentPlayer}
                  onMakingTurn={handleMakingTurn}
                  onDiceRoll={handleDiceRoll}
                />
              </Box>
              <Box position="absolute" width="50px" display="inline">
                <TimelapseButton variant="small" />
              </Box>
            </Box>
          )}
        </Box>
        {showBigTimelapse && (
          <Box textAlign="center" width="100%" position={'relative'}>
            <Box
              justifyContent="center"
              width={'100%'}
              position={'relative'}
              display={'inline-block'}
            >
              <TimelapseButton variant="big" />
              <Box position="absolute" width="200px" display="inline">
                <Button
                  sx={{ height: '44px' }}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  Затемнить карту
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {showTestButton && (
          <Box marginTop={'10px'} display="block" textAlign="center">
            <TesterButton player={currentPlayer} freezeDice={setFrozenDice} />
          </Box>
        )}
        {timelapseEnabled && <TimelapseButton variant="big" />}
      </StaticPanel>
      <TodaysMoves players={playersData?.players || []} />
    </Box>
  )
}

type PositionParams = {
  player: Player
  moves: number
  skipLadders?: boolean
}

function getNextPlayerPosition({ player, moves, skipLadders }: PositionParams) {
  const steps = getMoveSteps(player, moves)
  const newPosition = player.map_position + steps

  const ladder = laddersByCell[newPosition]
  const snake = snakesByCell[newPosition]

  if (ladder && !skipLadders) {
    return ladder.cellTo
  }
  if (snake) {
    return snake.cellTo
  }
  return Math.min(102, newPosition)
}

function getMoveSteps(player: Player, moves: number) {
  const newPosition = player.map_position + moves
  if (player.map_position < 101 && newPosition > 101) {
    return 101 - player.map_position
  }
  if (player.map_position === 101 && newPosition > 101) {
    return 1
  }
  if (newPosition < 0) {
    return -player.map_position
  }
  return moves
}

function formatSeconds(timeDiff: number) {
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60)
  const seconds = Math.floor((timeDiff / 1000) % 60)

  const hoursPadded = hours.toString().padStart(2, '0')
  const minutesPadded = minutes.toString().padStart(2, '0')
  const secondsPadded = seconds.toString().padStart(2, '0')

  return `${hoursPadded}:${minutesPadded}:${secondsPadded}`
}
