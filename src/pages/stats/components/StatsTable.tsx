import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import LinkSpan from 'src/components/LinkSpan'
import useLocalStorage from 'src/context/useLocalStorage'
import { playerDisplayName } from 'src/pages/player/components/utils'
import { fetchPlayers, fetchStats } from 'src/utils/api'
import { Color, getPlayerColor, Player } from 'src/utils/types'

type HeaderType =
  | 'name'
  | 'dice_average'
  | 'move_average'
  | 'stairs'
  | 'stairs_moves_sum'
  | 'snakes'
  | 'snakes_moves_sum'
  | 'total_moves'

type Props = {}

export default function StatsTable(props: Props) {
  const { save, load } = useLocalStorage()
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<HeaderType>(
    load('movesStatsOrderBy', 'name')
  )

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
    if (orderBy === 'dice_average') {
      return order === 'asc'
        ? (a.average_dice_roll || 0) - (b.average_dice_roll || 0)
        : (b.average_dice_roll || 0) - (a.average_dice_roll || 0)
    }
    if (orderBy === 'move_average') {
      return order === 'asc'
        ? (a.average_move || 0) - (b.average_move || 0)
        : (b.average_move || 0) - (a.average_move || 0)
    }
    if (orderBy === 'stairs') {
      return order === 'asc' ? a.ladders - b.ladders : b.ladders - a.ladders
    }
    if (orderBy === 'stairs_moves_sum') {
      return order === 'asc'
        ? a.ladders_moves_sum - b.ladders_moves_sum
        : b.ladders_moves_sum - a.ladders_moves_sum
    }
    if (orderBy === 'snakes') {
      return order === 'asc' ? a.snakes - b.snakes : b.snakes - a.snakes
    }
    if (orderBy === 'snakes_moves_sum') {
      return order === 'asc'
        ? a.snakes_moves_sum - b.snakes_moves_sum
        : b.snakes_moves_sum - a.snakes_moves_sum
    }
    if (orderBy === 'total_moves') {
      return order === 'asc'
        ? a.total_moves - b.total_moves
        : b.total_moves - a.total_moves
    }
    return 0
  })

  const onHeaderClick = (header: HeaderType) => {
    if (orderBy === header) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(header)
      save('movesStatsOrderBy', header)
      setOrder('desc')
    }
  }

  const headerStyle = {
    cursor: 'pointer',
    color: Color.greyNew,
  }

  const selectedStyle = {
    cursor: 'pointer',
    borderBottom: '1px solid white',
  }

  return (
    <Box>
      <Box
        textAlign={'center'}
        fontSize={'32px'}
        fontWeight={700}
        lineHeight={1}
      >
        Статистика ходов
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
                <TableCell>
                  <span
                    onClick={() => onHeaderClick('name')}
                    style={orderBy === 'name' ? selectedStyle : headerStyle}
                  >
                    Участник
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip title="Средний ролл кубика 1d6">
                    <span
                      onClick={() => onHeaderClick('dice_average')}
                      style={
                        orderBy === 'dice_average' ? selectedStyle : headerStyle
                      }
                    >
                      Средний ролл
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Средняя длина хода в любую сторону, без учета лестниц и змеек">
                    <span
                      onClick={() => onHeaderClick('move_average')}
                      style={
                        orderBy === 'move_average' ? selectedStyle : headerStyle
                      }
                    >
                      Средний ход
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() => onHeaderClick('stairs')}
                    style={orderBy === 'stairs' ? selectedStyle : headerStyle}
                  >
                    Лестницы
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip title="Количество клеток скипнутых по лестницам">
                    <span
                      onClick={() => onHeaderClick('stairs_moves_sum')}
                      style={
                        orderBy === 'stairs_moves_sum'
                          ? selectedStyle
                          : headerStyle
                      }
                    >
                      Буст лестниц
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() => onHeaderClick('snakes')}
                    style={orderBy === 'snakes' ? selectedStyle : headerStyle}
                  >
                    Змейки
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip title="Количество клеток которые пролетел по змейкам">
                    <span
                      onClick={() => onHeaderClick('snakes_moves_sum')}
                      style={
                        orderBy === 'snakes_moves_sum'
                          ? selectedStyle
                          : headerStyle
                      }
                    >
                      Падение по змейкам
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Без учета реролов">
                    <span
                      onClick={() => onHeaderClick('total_moves')}
                      style={
                        orderBy === 'total_moves' ? selectedStyle : headerStyle
                      }
                    >
                      Всего ходов
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersStatsSorted.map((playerStat, index) => {
                const player = playersById[playerStat.id]
                const displayName = playerDisplayName(player)
                const totalMoves =
                  playerStat.games_completed +
                  playerStat.games_dropped +
                  playerStat.movies +
                  playerStat.sheikh_moments

                return (
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
                      <Link to={`/players/${player.url_handle}`}>
                        <LinkSpan color={getPlayerColor(player.url_handle)}>
                          {displayName}
                        </LinkSpan>
                      </Link>
                    </TableCell>
                    <TableCell>{playerStat.average_dice_roll}</TableCell>
                    <TableCell>{playerStat.average_move}</TableCell>
                    <TableCell>{playerStat.ladders}</TableCell>
                    <TableCell>{playerStat.ladders_moves_sum}</TableCell>
                    <TableCell>{playerStat.snakes}</TableCell>
                    <TableCell>{playerStat.snakes_moves_sum}</TableCell>
                    <TableCell>{totalMoves}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
