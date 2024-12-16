import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getTimeDiffSeconds } from 'src/pages/map/components/utils'
import { getEventSecondsLeft } from 'src/pages/rules/components/Countdown'
import { fetchPlayerMoves, fetchPlayers, fetchStats } from 'src/utils/api'
import { Player } from 'src/utils/types'

const WINNER_TIMEOUT = 60 * 60 * 24 * 3

type StateResult = {
  state: 'active' | 'finished'
  players: Player[]
}

export default function useEventState(): StateResult {
  const finalCountdown = getEventSecondsLeft()

  const refetchInterval = 1000 * 60 * 2

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    refetchInterval,
    staleTime: 0,
  })

  const players = playersData?.players || []

  const playerWithMaxPosition =
    players.length > 0
      ? players.reduce((prev, current) =>
          prev.map_position > current.map_position ? prev : current
        )
      : null

  let winner: Player | null = null
  if (playerWithMaxPosition && playerWithMaxPosition.map_position > 101) {
    winner = playerWithMaxPosition
  }

  const { data: winnerMoves } = useQuery({
    queryKey: ['winnerMoves', winner?.id],
    queryFn: () => {
      if (winner) {
        return fetchPlayerMoves({ id: winner.id })
      }
      return null
    },
    refetchInterval,
    staleTime: 0,
    enabled: !!winner,
  })

  let lastWinnerMove = null

  if (winnerMoves && winnerMoves.moves.length > 0) {
    lastWinnerMove = winnerMoves.moves[0]
  }

  let winnerCountdown = null
  if (lastWinnerMove) {
    const timePassed = getTimeDiffSeconds(new Date(), lastWinnerMove.created_at)
    winnerCountdown = WINNER_TIMEOUT - timePassed
  }

  console.log('stats', winner, winnerCountdown, lastWinnerMove)

  const deadlineReached =
    finalCountdown <= 0 || (winner && winnerCountdown && winnerCountdown <= 0)

  return {
    state: deadlineReached ? 'finished' : 'active',
    players,
  }
}
