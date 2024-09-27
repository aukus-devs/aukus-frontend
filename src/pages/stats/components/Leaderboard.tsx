import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import BottomSection from 'components/BottomSection'
import LinkSpan from 'components/LinkSpan'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlayers, fetchStats } from 'utils/api'
import { getPlayerColor, Player, PlayerStats } from 'utils/types'

export default function Leaderboard() {
  const [fetchStart] = useState(Date.now())

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
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

  const playersStatsByPosition = playersStats.sort(
    (a, b) => b.map_position - a.map_position
  )

  const leader = playersStatsByPosition[0]
  const leaderPlayer = playersById[leader.id]
  const leaderColor = getPlayerColor(leaderPlayer)

  return (
    <Box>
      <Box textAlign={'center'}>
        <Typography fontSize={'48px'} fontWeight={700} lineHeight={1}>
          Лидерборд
        </Typography>
      </Box>
      <Box
        marginTop={2}
        marginLeft={4}
        marginRight={4}
        justifyContent="center"
        display="flex"
      >
        <TableContainer sx={{ width: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  #
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Участник
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Позиция на карте
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Очки
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Пройдено игр
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Дропы
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Реролы
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Просмотры фильмов
                </TableCell>
                <TableCell sx={{ borderBottom: `2px solid ${leaderColor}` }}>
                  Шейх-моменты
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersStatsByPosition.map((playerStat, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`/players/${playersById[playerStat.id].url_handle}`}
                    >
                      <LinkSpan
                        color={getPlayerColor(playersById[playerStat.id])}
                      >
                        {playersById[playerStat.id].name}
                      </LinkSpan>
                    </Link>
                  </TableCell>
                  <TableCell>{playerStat.map_position}</TableCell>
                  <TableCell>{getPlayerScore(playerStat)}</TableCell>
                  <TableCell>{playerStat.games_completed}</TableCell>
                  <TableCell>{playerStat.games_dropped}</TableCell>
                  <TableCell>{playerStat.rerolls}</TableCell>
                  <TableCell>{playerStat.movies}</TableCell>
                  <TableCell>{playerStat.sheikh_moments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

function getPlayerScore(player: PlayerStats) {
  const row = Math.floor(player.map_position / 10) || 1
  return player.games_completed * row - player.games_dropped
}