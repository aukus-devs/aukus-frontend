import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import find from 'lodash/find'
import MoveCard from 'pages/player/components/MoveCard'
import useScreenSize from 'src/context/useScreenSize'
import { fetchPlayerMoves } from 'utils/api'
import { Player } from 'utils/types'

type Props = {
  players: Player[]
}

export default function TodaysMoves({ players }: Props) {
  const { headerSize } = useScreenSize()
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)

  const { data: todaysMoves, refetch: refetchMoves } = useQuery({
    queryKey: ['todaysMoves'],
    queryFn: () => fetchPlayerMoves({ limit: 10 }),
    refetchInterval: 1000 * 60,
  })

  if (!todaysMoves) {
    return null
  }

  return (
    <Box>
      <Box marginTop={'20px'} textAlign={'center'} marginBottom={'50px'}>
        <Box fontWeight={600} fontSize={headerSize}>
          Последние ходы
        </Box>
      </Box>
      {todaysMoves.moves.map((move, index) => {
        const player = find(players, (player) => player.id === move.player_id)
        if (!player) {
          return null
        }
        return (
          <Box key={index}>
            <MoveCard
              move={move}
              id={move.player_move_id}
              player={player}
              displayType="map"
              onSave={refetchMoves}
            />
          </Box>
        )
      })}
    </Box>
  )
}
