import { Box } from '@mui/material'
import TodaysMoves from './TodaysMoves'
import { fetchPlayers } from 'src/utils/api'
import { useQuery } from '@tanstack/react-query'
import { Color, getPlayerColor, Player } from 'src/utils/types'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTimeDiffSeconds } from './utils'
import { formatSecondsToTime } from 'src/pages/player/components/utils'
import { formatSeconds } from './MapComponent'
import LinkSpan from 'src/components/LinkSpan'

const WINNER_COUNTDOWN_START = 60 * 60 * 24 * 3
const WINNER_LAST_MOVE_TIME = '2024-12-16 12:02:12'
const Winner = 'krabick'

export default function MapComponentMobile() {
  const [winnerCountdown, setWinnerCountdown] = useState(WINNER_COUNTDOWN_START)

  useEffect(() => {
    const interval = setInterval(() => {
      const timePassed = getTimeDiffSeconds(new Date(), WINNER_LAST_MOVE_TIME)
      // console.log('time passed', formatSeconds(timePassed))
      const diff = WINNER_COUNTDOWN_START - timePassed
      setWinnerCountdown(diff)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    refetchInterval: 1000 * 30,
  })

  const players = playersData?.players || []

  const winner = players.find((player) => player.url_handle === Winner)

  const playersGroupedByMapPosition = players.reduce(
    (acc, player) => {
      const { map_position } = player
      if (!acc[map_position]) {
        acc[map_position] = [] as Player[]
      }
      acc[map_position].push(player)
      return acc
    },
    {} as Record<number, Player[]>
  )

  const mapPositionsOrdered = Object.keys(playersGroupedByMapPosition)
    .map(Number)
    .sort((a: number, b: number) => b - a)

  const showWinMessage = winnerCountdown <= 0

  return (
    <Box marginTop={'100px'}>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}
        marginBottom="50px"
        fontSize="24px"
        marginLeft="10px"
        marginRight="10px"
        padding="10px"
        borderRadius="10px"
        textAlign="center"
        style={{
          backgroundColor: Color.greyLight,
        }}
      >
        {showWinMessage && winner ? (
          <Box>
            Можете выдыхать, ивент закончен <br />
            <Link to={`/players/${winner.url_handle}`}>
              <LinkSpan color={getPlayerColor(winner.url_handle)}>
                {winner.name}
              </LinkSpan>
            </Link>{' '}
            победил!
          </Box>
        ) : (
          <Box>
            До конца ивента <br />
            <span className={'mono'}>{formatSeconds(winnerCountdown)}</span>
          </Box>
        )}
      </Box>
      <Box
        width={'fit-content'}
        margin={'auto'}
        fontWeight={600}
        fontSize={'36px'}
        marginLeft={'10px'}
        marginRight={'10px'}
        lineHeight={'1.2'}
      >
        <Box>Положение на карте</Box>
      </Box>
      <Box marginLeft={'10px'} marginRight={'10px'}>
        {mapPositionsOrdered.map((cell, index) => {
          const players = playersGroupedByMapPosition[cell]
          return <MapPosition key={index} players={players} cell={cell} />
        })}
      </Box>
      <TodaysMoves players={players} />
    </Box>
  )
}

function MapPosition({ cell, players }: { cell: number; players: Player[] }) {
  return (
    <Box marginTop={'50px'}>
      <Box marginLeft={'15px'} fontSize={'12px'}>
        КЛЕТКА — {cellName(cell)}
      </Box>
      <Box>
        {players.map((player, index) => {
          let gameImage = player.current_game_image
          if (gameImage) {
            gameImage = gameImage
              .replace('{width}', '200')
              .replace('{height}', '300')
          }

          return (
            <Link
              key={index}
              to={`/players/${player.url_handle}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                key={index}
                borderRadius={'10px'}
                padding={'15px'}
                marginTop={'15px'}
                style={{ backgroundColor: getPlayerColor(player.url_handle) }}
              >
                <Box
                  fontSize={'12px'}
                  color="rgba(255,255,255,0.8)"
                  textTransform={'uppercase'}
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Box>{player.name}</Box>
                  <Box>{player.is_online ? 'стримит' : 'офлайн'}</Box>
                </Box>
                {player.current_game && (
                  <Box display="flex" marginTop={'10px'}>
                    <Box marginRight={'10px'}>
                      {gameImage ? (
                        <img
                          src={gameImage}
                          width={'66px'}
                          height={'99px'}
                          style={{ borderRadius: '5px' }}
                        />
                      ) : (
                        <ImagePlaceholder
                          style={{
                            width: '66px',
                            height: '99px',
                            borderRadius: '5px',
                          }}
                        />
                      )}
                    </Box>
                    <Box fontSize={'32px'}>{player.current_game}</Box>
                  </Box>
                )}
              </Box>
            </Link>
          )
        })}
      </Box>
    </Box>
  )
}

function cellName(cell: number) {
  if (cell === 0) {
    return 'Старт'
  }
  if (cell === 101) {
    return 'Финальный рывок'
  }
  if (cell === 102) {
    return 'Финиш'
  }
  return cell
}
