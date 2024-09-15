import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchPlayers, fetchStats } from 'utils/api'
import { Player } from 'utils/types'

export default function StatsPage() {
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
    return <div>Loading...</div>
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

  return (
    <Box>
      <Box textAlign={'center'}>
        <h2>Лидерборд</h2>
      </Box>
      <Box
        marginTop={2}
        marginLeft={4}
        marginRight={4}
        justifyContent="center"
        display="flex"
      >
        <TableContainer sx={{ width: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Участник</TableCell>
              <TableCell>Позиция на карте</TableCell>
              <TableCell>Очки</TableCell>
              <TableCell>Пройдено игр</TableCell>
              <TableCell>Дропы</TableCell>
              <TableCell>Реролы</TableCell>
              <TableCell>Просмотры фильмов</TableCell>
              <TableCell>Шейх-моменты</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playersStatsByPosition.map((playerStat, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{playersById[playerStat.id].name}</TableCell>
                <TableCell>{playerStat.map_position}</TableCell>
                <TableCell>{0}</TableCell>
                <TableCell>{playerStat.games_completed}</TableCell>
                <TableCell>{playerStat.games_dropped}</TableCell>
                <TableCell>{playerStat.rerolls}</TableCell>
                <TableCell>{playerStat.movies}</TableCell>
                <TableCell>{playerStat.sheikh_moments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Box>
    </Box>
  )
}