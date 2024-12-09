import { Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import find from 'lodash/find'
import MoveCard from 'pages/player/components/MoveCard'
import { useState } from 'react'
import useScreenSize from 'src/context/useScreenSize'
import { fetchPlayerMoves } from 'utils/api'
import { Player } from 'utils/types'

type Props = {
  players: Player[]
}

export default function TodaysMoves({ players }: Props) {
  const { headerSize } = useScreenSize()
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)

  const [limit, setLimit] = useState(10)

  const { data: todaysMoves, refetch: refetchMoves } = useQuery({
    queryKey: ['todaysMoves', limit],
    queryFn: () => fetchPlayerMoves({ limit }),
    refetchInterval: 1000 * 60,
    placeholderData: (prevData, prevQuery) => prevData,
  })

  if (!todaysMoves) {
    return null
  }

  const increaseLimit = () => {
    setLimit(limit + 10)
  }

  const showMoreButton = todaysMoves.moves.length < todaysMoves.moves.length

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
      {showMoreButton && (
        <Box display={'flex'} justifyContent={'center'}>
          <Button onClick={increaseLimit}>Показать еще</Button>
        </Box>
      )}
    </Box>
  )
}
