import { useQuery } from '@tanstack/react-query'
import { getPlayerScore } from 'src/pages/stats/components/Leaderboard'
import { fetchPlayers, fetchStats } from 'src/utils/api'
import { Player, PlayerStats } from 'src/utils/types'

type ReturnType = {
  players: Player[]
  playersStats: PlayerStats[]
  scoreByPlayerId: Record<number, number>
}

export default function usePlayersScores(): ReturnType {
  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    staleTime: 1000 * 60 * 1,
  })
  const players = playersData?.players || []

  const { data } = useQuery({
    queryKey: ['playersStats'],
    queryFn: () => fetchStats(),
    staleTime: 1000 * 60 * 1,
  })
  const playersStats = data?.players || []

  const scoreByPlayerId = playersStats.reduce(
    (acc, player) => {
      acc[player.id] = getPlayerScore(player)
      return acc
    },
    {} as Record<number, number>
  )

  return {
    players,
    playersStats,
    scoreByPlayerId,
  }
}
