import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import LinkSpan from 'components/LinkSpan'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useScreenSize from 'src/context/useScreenSize'
import { fetchPlayers, fetchStats } from 'utils/api'
import { Color, getPlayerColor, Player, PlayerStats } from 'utils/types'

type HeaderType =
  | 'id'
  | 'name'
  | 'map_position'
  | 'score'
  | 'games_completed'
  | 'games_dropped'
  | 'rerolls'
  | 'movies'
  | 'sheikh_moments'

export default function Leaderboard() {
  const { headerSize } = useScreenSize()
  const [fetchStart] = useState(Date.now())
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<HeaderType>('map_position')

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
    if (orderBy === 'name') {
      return order === 'asc'
        ? playersById[a.id].name.localeCompare(playersById[b.id].name)
        : playersById[b.id].name.localeCompare(playersById[a.id].name)
    }
    if (orderBy === 'map_position') {
      return order === 'asc'
        ? a.map_position - b.map_position
        : b.map_position - a.map_position
    }
    if (orderBy === 'score' || orderBy === 'id') {
      return order === 'asc'
        ? getPlayerScore(a) - getPlayerScore(b)
        : getPlayerScore(b) - getPlayerScore(a)
    }
    if (orderBy === 'games_completed') {
      return order === 'asc'
        ? a.games_completed - b.games_completed
        : b.games_completed - a.games_completed
    }
    if (orderBy === 'games_dropped') {
      return order === 'asc'
        ? a.games_dropped - b.games_dropped
        : b.games_dropped - a.games_dropped
    }
    if (orderBy === 'rerolls') {
      return order === 'asc' ? a.rerolls - b.rerolls : b.rerolls - a.rerolls
    }
    if (orderBy === 'movies') {
      return order === 'asc' ? a.movies - b.movies : b.movies - a.movies
    }
    if (orderBy === 'sheikh_moments') {
      return order === 'asc'
        ? a.sheikh_moments - b.sheikh_moments
        : b.sheikh_moments - a.sheikh_moments
    }
    return 0
  })

  const orderedByScore = [...playersStats].sort((a, b) => {
    return getPlayerScore(b) - getPlayerScore(a)
  })

  // maps player ids to position by score, players with same score get the same position
  const playerIdToPosition = orderedByScore.reduce(
    (acc, player, index) => {
      if (index === 0) {
        acc[player.id] = 1
      } else {
        const prevPlayer = orderedByScore[index - 1]
        if (getPlayerScore(player) === getPlayerScore(prevPlayer)) {
          acc[player.id] = acc[prevPlayer.id]
        } else {
          acc[player.id] = acc[prevPlayer.id] + 1
        }
      }
      return acc
    },
    {} as Record<number, number>
  )

  const headerStyle = {
    cursor: 'pointer',
    color: Color.greyNew,
  }

  const selectedStyle = {
    cursor: 'pointer',
    borderBottom: '1px solid white',
  }

  const onHeaderClick = (header: HeaderType) => {
    if (orderBy === header) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(header)
      setOrder('desc')
    }
  }

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
        display="flex"
      >
        <TableContainer sx={{ width: 'auto' }}>
          <Table
            style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}
          >
            <TableHead>
              <TableRow>
                <TableCell onClick={() => onHeaderClick('id')}>
                  <span style={orderBy === 'id' ? selectedStyle : headerStyle}>
                    Место
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('name')}>
                  <span
                    style={orderBy === 'name' ? selectedStyle : headerStyle}
                  >
                    Участник
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('map_position')}>
                  <span style={{ width: '80px', display: 'block' }}>
                    <span
                      style={
                        orderBy === 'map_position' ? selectedStyle : headerStyle
                      }
                    >
                      Позиция
                    </span>
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('score')}>
                  <span style={{ display: 'block', width: '60px' }}>
                    <span
                      style={orderBy === 'score' ? selectedStyle : headerStyle}
                    >
                      Очки
                    </span>
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('games_completed')}>
                  <span style={{ display: 'block', width: '130px' }}>
                    <span
                      style={
                        orderBy === 'games_completed'
                          ? selectedStyle
                          : headerStyle
                      }
                    >
                      Пройдено игр
                    </span>
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('games_dropped')}>
                  <span
                    style={
                      orderBy === 'games_dropped' ? selectedStyle : headerStyle
                    }
                  >
                    Дропы
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('rerolls')}>
                  <span
                    style={orderBy === 'rerolls' ? selectedStyle : headerStyle}
                  >
                    Реролы
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('movies')}>
                  <span
                    style={orderBy === 'movies' ? selectedStyle : headerStyle}
                  >
                    Фильмы
                  </span>
                </TableCell>
                <TableCell onClick={() => onHeaderClick('sheikh_moments')}>
                  <span
                    style={
                      orderBy === 'sheikh_moments' ? selectedStyle : headerStyle
                    }
                  >
                    Шейх-моменты
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersStatsSorted.map((playerStat, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: Color.greyDark,
                    height: '39px',
                    borderRadius: '10px',
                    verticalAlign: 'middle',
                  }}
                >
                  <TableCell style={{ height: '39px' }}>
                    <Box display="flex" alignItems={'center'}>
                      <Box width={'10px'}>
                        {playerIdToPosition[playerStat.id]}
                      </Box>
                      <Divider
                        flexItem
                        orientation="vertical"
                        style={{
                          borderRightWidth: '3px',
                          marginLeft: '30px',
                          borderRadius: '2px',
                          height: '29px',
                          borderColor: getPlayerColor(
                            playersById[playerStat.id].url_handle
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/players/${playersById[playerStat.id].url_handle}`}
                    >
                      <LinkSpan
                        color={getPlayerColor(
                          playersById[playerStat.id].url_handle
                        )}
                        hideUnderline
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

export function getPlayerScore(player: PlayerStats) {
  const shortGames = player.short_games || 0
  const mediumGames = player.medium_games || 0
  const longGames = player.long_games || 0
  const tinyGames = player.tiny_games || 0

  const shortGamesScore = (shortGames + tinyGames) * 1
  const mediumGamesScore = mediumGames * 1.5
  const longGamesScore = longGames * 2

  const row = Math.floor(player.map_position / 10) || 1
  return (
    (shortGamesScore +
      mediumGamesScore +
      longGamesScore -
      player.games_dropped) *
    row
  )
}
