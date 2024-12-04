import { Box } from '@mui/material'
import TodaysMoves from './TodaysMoves'
import { fetchPlayers } from 'src/utils/api'
import { useQuery } from '@tanstack/react-query'
import { getPlayerColor, Player } from 'src/utils/types'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'
import { Link } from 'react-router-dom'

export default function MapComponentMobile() {
  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    refetchInterval: 1000 * 30,
  })

  const players = playersData?.players || []

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

  return (
    <Box marginTop={'100px'}>
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
