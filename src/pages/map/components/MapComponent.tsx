import { Box, Button, Grid, Tooltip } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from 'context/UserProvider'
import useScreenSize from 'context/useScreenSize'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import TreeAnimation from 'assets/map/tree2.gif'
import TgaImage from 'assets/map/tga.png'
import {
  createPlayerMove,
  fetchPlayerMoves,
  fetchPlayers,
  fetchStats,
} from 'utils/api'
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
  getTimeDiffSeconds,
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
import { getEventSecondsLeft } from 'src/pages/rules/components/Countdown'

const WINNER_COUNTDOWN_START = 60 * 60 * 24 * 3
const END_COUNTDOWN_START = 60 * 60 * 24 * 3

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

  const [finalCountdown, setFinalCountdown] = useState(() =>
    getEventSecondsLeft()
  )
  const [winnerCountdown, setWinnerCountdown] = useState(WINNER_COUNTDOWN_START)

  const darkMode = load('darkMode', false)

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

  const playersLoaded = playersData && playersData?.players.length > 0

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

  const winnerFound =
    !timelapseEnabled &&
    playerWithMaxPosition &&
    playerWithMaxPosition.map_position > 101

  let topPlayers: Player[] = []
  let winner: Player | null = null
  if (winnerFound) {
    topPlayers.push(playerWithMaxPosition)
    winner = playerWithMaxPosition
  }

  const deadlineReached = finalCountdown <= 0 || winnerCountdown <= 0

  const { data: playerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['playersStats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 1,
    enabled: deadlineReached,
  })
  const playersStats = playerStats?.players || []

  const { data: winnerMoves, isLoading: movesLoading } = useQuery({
    queryKey: ['winnerMoves', winner?.id],
    queryFn: () => {
      if (winner) {
        return fetchPlayerMoves({ id: winner.id })
      }
      return null
    },
    staleTime: 1000 * 60 * 1,
    enabled: !!winner,
  })

  let lastWinnerMove = null

  // console.log('winnerMoves', winnerMoves)

  if (winnerMoves && winnerMoves.moves.length > 0) {
    lastWinnerMove = winnerMoves.moves[0]
  }

  let showCountdown = false
  let timerText = ''
  if (playersLoaded) {
    if (winner) {
      if (winnerCountdown < WINNER_COUNTDOWN_START) {
        const smallerCoundown = Math.min(winnerCountdown, finalCountdown)
        showCountdown = true
        timerText = formatSeconds(smallerCoundown)
      }
    } else if (finalCountdown <= END_COUNTDOWN_START) {
      showCountdown = true
      timerText = formatSeconds(finalCountdown)
    }
  }

  // console.log('timerText', timerText)

  useEffect(() => {
    const getSecondsLeftSinceLastMove = () => {
      // console.log('last move', lastWinnerMove)
      if (!lastWinnerMove) {
        return null
      }

      const timePassed = getTimeDiffSeconds(
        new Date(),
        lastWinnerMove.created_at
      )
      // console.log('time passed', formatSeconds(timePassed))
      return WINNER_COUNTDOWN_START - timePassed
    }

    const interval = setInterval(() => {
      const timeLeftWinner = getSecondsLeftSinceLastMove()
      const difference = getEventSecondsLeft()
      if (timeLeftWinner) {
        setWinnerCountdown(timeLeftWinner)
      }
      // console.log('update distance', timeLeftWinner, difference)
      setFinalCountdown(difference)
    }, 1000)

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [lastWinnerMove])

  if (playersStats.length > 0) {
    const statsByScore = playersStats
      .filter((player) => {
        if (winner) {
          return player.id !== winner.id
        }
        return true
      })
      .sort((a, b) => getPlayerScore(b) - getPlayerScore(a))

    const top3players = statsByScore
      .slice(0, 3) // Get the top 3 player stats
      .map((stat) => players.find((player) => player.id === stat.id)) // Map to player objects
      .filter((player): player is Player => !!player) // Filter out any undefined results

    topPlayers.push(...top3players)
  }

  const showWinScreen = deadlineReached && topPlayers.length > 0

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

    const nextPosition = getNextPlayerPosition({
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
      move_to: nextPosition.position,
      stair_from: nextPosition.stairsFrom,
      stair_to: nextPosition.stairsTo,
      snake_from: nextPosition.snakeFrom,
      snake_to: nextPosition.snakeTo,
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

  const handleAnimationEnd = ({
    player,
    moveParams,
  }: {
    player: Player
    moveParams: MoveParams
  }) => {
    if (player.id !== currentPlayer?.id) {
      return
    }
    const newPosition = getNextPlayerPosition({
      player,
      moves: moveParams.steps,
      skipLadders: moveParams.skipLadders,
    })
    player.map_position = newPosition.position
    // setMoveSteps(0)
    setMoveParams(null)
    setMakingTurn(false)
    setStartWinAnimation(false)
    queryClient.invalidateQueries({ queryKey: ['players'] })
  }

  // console.log('winner', winner, topPlayers)
  const animating = startWinAnimation || moveParams !== null

  const currentPlayerWinner =
    currentPlayer && winner && currentPlayer.id === winner.id

  const stopActions = showWinScreen || animating || currentPlayerWinner
  const showActionButton = currentPlayer && !timelapseEnabled && !stopActions
  const showBigTimelapse = !showActionButton && !timelapseEnabled && !animating

  const showTestButton = currentPlayer && !timelapseEnabled && false

  const totalOnline = players.reduce((acc, player) => {
    return acc + (player.online_count || 0)
  }, 0)

  const playAnimationSteps = timelapseState.currentAnimationMove?.dice_roll
  const playAnimationPlayer =
    players.find(
      (player) => player.id === timelapseState.currentAnimationMove?.player_id
    ) || currentPlayer

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

      {showWinScreen && (
        <Box display={'flex'} justifyContent={'center'}>
          <Box
            fontSize={'20px'}
            textAlign={'center'}
            style={{
              backgroundColor: getPlayerColor(topPlayers[0].url_handle),
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
                <Link to={`/players/${topPlayers[0].url_handle}`}>
                  <LinkSpan color={'white'}>{topPlayers[0].name}</LinkSpan>{' '}
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
            background: darkMode
              ? "linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url('uploads/aukus_map_compressed.png')"
              : 'url("uploads/aukus_map_compressed.png")',
            backgroundRepeat:
              'no-repeat' /* Prevent the image from repeating */,
            backgroundPosition: 'center' /* Center the image */,
          }}
        >
          <Box position="relative">
            <Box position={'absolute'} left={'419px'} top={'222px'}>
              <img
                src={TreeAnimation}
                style={{
                  filter: darkMode ? 'brightness(0.6)' : 'none',
                }}
              />
            </Box>
          </Box>
          <Box position="relative">
            <Box
              position={'absolute'}
              left={'620px'}
              top={'470px'}
              // style={{ backgroundColor: 'brown' }}
              fontSize={'14px'}
              // border={'1px solid grey'}
              textAlign={'center'}
              width={'120px'}
              height={'60px'}
              // display={'none'}
              zIndex={20}
              lineHeight={1.2}
              style={{
                background: 'url("static/map_banner.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                color: 'black',
              }}
            >
              <Box marginTop={'15px'}>
                <Tooltip title="Суммарно на всех стримах">
                  <span>
                    {totalOnline}
                    <br />
                    зрителей
                  </span>
                </Tooltip>
              </Box>
            </Box>
            <Box
              style={{
                position: 'absolute',
                left: '-30px',
                top: '-140px',
                width: '300px',
                height: '500px',
                zIndex: 20,
                backgroundImage: `url(${TgaImage})`,
                backgroundRepeat: 'no-repeat',
                // backgroundPosition: 'center',
                backgroundSize: 'contain',
                // backgroundColor: 'red',
              }}
            />
          </Box>
          {winner && !showWinScreen && (
            <PlayerWinnerIcon
              player={winner}
              position={1}
              isMoving
              closePopup={closePopups}
            />
          )}
          {showWinScreen && topPlayers.length > 2 && (
            <>
              <PlayerWinnerIcon
                player={topPlayers[0]}
                position={1}
                isMoving
                closePopup={closePopups}
              />
              <PlayerWinnerIcon
                player={topPlayers[1]}
                position={2}
                closePopup={closePopups}
              />
              <PlayerWinnerIcon
                player={topPlayers[2]}
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
                  currentPlayer={playAnimationPlayer}
                  moveSteps={moveParams?.steps || playAnimationSteps}
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
                      currentPlayer={playAnimationPlayer}
                      moveSteps={moveParams?.steps || playAnimationSteps}
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

      {players.map((player) => {
        const timelapseAnimationParams: Partial<
          React.ComponentProps<typeof PlayerIcon>
        > = {}
        // console.log('timelapseState', timelapseState)
        if (
          timelapseState.playMode &&
          timelapseState.currentAnimationMove?.player_id === player.id
        ) {
          const moveParams = {
            steps: timelapseState.currentAnimationMove.dice_roll,
            skipLadders:
              timelapseState.currentAnimationMove.item_length === 'tiny',
            cellFrom: timelapseState.currentAnimationMove.cell_from,
          }
          timelapseAnimationParams['moveParams'] = moveParams
          timelapseAnimationParams['onAnimationEnd'] =
            timelapseState.onAnimationEnd
          timelapseAnimationParams['animationDuration'] = 500
        }
        // console.log('map player', player.name, player.map_position)
        return (
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
            {...timelapseAnimationParams}
          />
        )
      })}
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
                    sx={{
                      height: '44px',
                      backgroundColor: darkMode
                        ? 'primary.dark'
                        : 'primary.main',
                    }}
                    onClick={() => save('darkMode', !darkMode)}
                  >
                    Затемнить карту
                  </Button>
                </Box>
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
                  sx={{
                    height: '44px',
                    backgroundColor: darkMode ? 'rgb(0, 85, 178)' : 'primary',
                  }}
                  onClick={() => save('darkMode', !darkMode)}
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
    return {
      position: ladder.cellTo,
      stairsFrom: ladder.cellFrom,
      stairsTo: ladder.cellTo,
      snakeFrom: null,
      snakeTo: null,
    }
  }
  if (snake) {
    return {
      position: snake.cellTo,
      stairsFrom: null,
      stairsTo: null,
      snakeFrom: snake.cellFrom,
      snakeTo: snake.cellTo,
    }
  }

  const finalPosition = Math.min(102, newPosition)
  return {
    position: finalPosition,
    stairsFrom: null,
    stairsTo: null,
    snakeFrom: null,
    snakeTo: null,
  }
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
  const hours = Math.floor((timeDiff / (60 * 60)) % 24)
  const minutes = Math.floor((timeDiff / 60) % 60)
  const seconds = Math.floor(timeDiff % 60)
  const days = Math.floor(timeDiff / (60 * 60 * 24))

  const hoursPadded = hours.toString().padStart(2, '0')
  const minutesPadded = minutes.toString().padStart(2, '0')
  const secondsPadded = seconds.toString().padStart(2, '0')

  if (days > 0) {
    return `${days}д ${hoursPadded}:${minutesPadded}:${secondsPadded}`
  }
  return `${hoursPadded}:${minutesPadded}:${secondsPadded}`
}
