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
        let showDate = false
        const currentDay = new Date(move.created_at)
        const prevMove = todaysMoves.moves[index - 1]
        console.log('prev move', prevMove)
        if (prevMove) {
          const prevDay = new Date(prevMove.created_at)
          if (
            prevDay.getDate() !== currentDay.getDate() ||
            prevDay.getMonth() !== currentDay.getMonth() ||
            prevDay.getFullYear() !== currentDay.getFullYear()
          ) {
            showDate = true
          }
        }

        return (
          <Box key={index}>
            {showDate && (
              <Box
                marginTop={'40px'}
                marginBottom={'50px'}
                textAlign={'center'}
                fontSize={'48px'}
                lineHeight={1.2}
              >
                {formatDayMonth(currentDay)}
              </Box>
            )}
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

function formatDayMonth(date: Date) {
  return date.toLocaleString('ru', {
    day: 'numeric',
    month: 'long',
  })
}
