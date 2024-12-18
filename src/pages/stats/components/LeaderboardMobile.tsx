import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import useScreenSize from 'src/context/useScreenSize'
import { fetchPlayers, fetchStats } from 'utils/api'
import { Player } from 'utils/types'
import PlayerStatMobile from './PlayerStatMobile'
import { Link } from 'react-router-dom'
import { getPlayerScore } from './Leaderboard'

export default function LeaderboardMobile() {
  const { headerSize } = useScreenSize()
  const [fetchStart] = useState(Date.now())

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    staleTime: 1000 * 60 * 1,
  })
  const players = playersData?.players

  const { data } = useQuery({
    queryKey: ['playersStats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 1,
  })
  const playersStats = data?.players

  if (!playersStats || !players) {
    if (Date.now() - fetchStart > 1000) {
      return <div>Loading...</div>
    }
    return null
  }

  const playersById = players.reduce(
    (acc, player) => {
      acc[player.id] = player
      return acc
    },
    {} as Record<number, Player>
  )

  const playersStatsSorted = playersStats.sort((a, b) => {
    return getPlayerScore(b) - getPlayerScore(a)
  })

  return (
    <Box>
      <Box textAlign={'center'}>
        <Typography fontSize={headerSize} fontWeight={700} lineHeight={1}>
          Таблица лидеров
        </Typography>
      </Box>
      <Box
        marginLeft={4}
        marginRight={4}
        marginTop={'50px'}
        justifyContent="center"
      >
        {playersStatsSorted.map((stat, index) => {
          const player = playersById[stat.id]
          return (
            <Link
              key={index}
              to={`/players/${playersById[stat.id].url_handle}`}
            >
              <PlayerStatMobile stat={stat} player={player} />
            </Link>
          )
        })}
      </Box>
    </Box>
  )
}
