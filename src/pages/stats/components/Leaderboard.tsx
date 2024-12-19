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
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import LinkSpan from 'components/LinkSpan'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorage from 'src/context/useLocalStorage'
import usePlayersScores from 'src/context/usePlayersScores'
import useScreenSize from 'src/context/useScreenSize'
import {
  formatSecondsToTime,
  playerDisplayName,
} from 'src/pages/player/components/utils'
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
  const { save, load } = useLocalStorage()
  const { headerSize } = useScreenSize()
  const [fetchStart] = useState(Date.now())
  const [orderBy, setOrderBy] = useState<HeaderType>(
    load('leaderboardOrderBy', 'id')
  )
  const [order, setOrder] = useState<'asc' | 'desc'>(() => {
    if (orderBy === 'id') {
      return 'asc'
    } else {
      return 'desc'
    }
  })

  const { players, playersStats, winner, winner2 } = usePlayersScores()

  if (!(playersStats.length > 0) || !(players.length > 0)) {
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

  const orderedByScore = [...playersStats].sort((a, b) => {
    return getPlayerScore(b) - getPlayerScore(a)
  })

  const orderedByPosition = [...orderedByScore]

  // if there is a winner he should be at the top of the list
  if (winner2) {
    const winnerIndex = orderedByPosition.findIndex(
      (player) => player.id === winner2.id
    )
    if (winnerIndex > 0) {
      const winnerStats = orderedByPosition[winnerIndex]
      orderedByPosition.splice(winnerIndex, 1)
      orderedByPosition.unshift(winnerStats)
    }
  }

  if (winner) {
    const winnerIndex = orderedByPosition.findIndex(
      (player) => player.id === winner.id
    )
    if (winnerIndex > 0) {
      const winnerStats = orderedByPosition[winnerIndex]
      orderedByPosition.splice(winnerIndex, 1)
      orderedByPosition.unshift(winnerStats)
    }
  }

  if (winner2) {
    const winnerIndex = orderedByPosition.findIndex(
      (player) => player.id === winner2.id
    )
    if (winnerIndex > 0) {
      const winnerStats = orderedByPosition[winnerIndex]
      orderedByPosition.splice(winnerIndex, 1)
      orderedByPosition.unshift(winnerStats)
    }
  }



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
    if (orderBy === 'score') {
      return order === 'asc'
        ? getPlayerScore(a) - getPlayerScore(b)
        : getPlayerScore(b) - getPlayerScore(a)
    }
    if (orderBy === 'id') {
      // use orderedByPosition to compare
      const playerAIndex = orderedByPosition.findIndex(
        (player) => player.id === a.id
      )
      const playerBIndex = orderedByPosition.findIndex(
        (player) => player.id === b.id
      )

      return order === 'asc'
        ? playerAIndex - playerBIndex
        : playerBIndex - playerAIndex
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

  // maps player ids to position by score, players with same score get the same position
  const playerIdToPosition = orderedByPosition.reduce(
    (acc, player, index) => {
      if (index === 0) {
        acc[player.id] = 1
      } else {
        const prevPlayer = orderedByPosition[index - 1]
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
      save('leaderboardOrderBy', header)
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
                <TableCell>
                  <span
                    onClick={() => onHeaderClick('id')}
                    style={orderBy === 'id' ? selectedStyle : headerStyle}
                  >
                    Место
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() => onHeaderClick('name')}
                    style={orderBy === 'name' ? selectedStyle : headerStyle}
                  >
                    Участник
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ width: '69px', display: 'block' }}>
                    <span
                      onClick={() => onHeaderClick('map_position')}
                      style={
                        orderBy === 'map_position' ? selectedStyle : headerStyle
                      }
                    >
                      Позиция
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip title="Наведи на очки чтобы увидеть подорбный расчет">
                    <span style={{ display: 'block', width: '40px' }}>
                      <span
                        onClick={() => onHeaderClick('score')}
                        style={
                          orderBy === 'score' ? selectedStyle : headerStyle
                        }
                      >
                        Очки
                      </span>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span style={{ display: 'block', width: '80px' }}>
                    <span
                      onClick={() => onHeaderClick('games_completed')}
                      style={
                        orderBy === 'games_completed'
                          ? selectedStyle
                          : headerStyle
                      }
                    >
                      Пройдено
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ display: 'block', width: '53px' }}>
                    <span
                      onClick={() => onHeaderClick('games_dropped')}
                      style={
                        orderBy === 'games_dropped'
                          ? selectedStyle
                          : headerStyle
                      }
                    >
                      Дропы
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ display: 'block', width: '61px' }}>
                    <span
                      onClick={() => onHeaderClick('rerolls')}
                      style={
                        orderBy === 'rerolls' ? selectedStyle : headerStyle
                      }
                    >
                      Реролы
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ display: 'block', width: '66px' }}>
                    <span
                      onClick={() => onHeaderClick('movies')}
                      style={orderBy === 'movies' ? selectedStyle : headerStyle}
                    >
                      Фильмы
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip title="Сработавшие шейх-моменты">
                    <span style={{ display: 'block', width: '54px' }}>
                      <span
                        onClick={() => onHeaderClick('sheikh_moments')}
                        style={
                          orderBy === 'sheikh_moments'
                            ? selectedStyle
                            : headerStyle
                        }
                      >
                        Шейхи
                      </span>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span style={{ display: 'block', maxWidth: '285px' }}>
                    Сейчас
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersStatsSorted.map((playerStat, index) => {
                const player = playersById[playerStat.id]
                const displayName = playerDisplayName(player)
                const playerStream =
                  player?.twitch_stream_link ||
                  player?.vk_stream_link ||
                  player?.kick_stream_link
                const score = getPlayerScore(playerStat)
                const scoreDetails = getScoreDetails(playerStat)
                const shortGames =
                  scoreDetails.tinyGames + scoreDetails.shortGames

                let duration = null
                if (player.current_game_duration) {
                  duration = formatSecondsToTime(player.current_game_duration)
                }

                let currentGameText = player.current_game
                  ?.replace(/\s\(\d{4}\)$/, '')
                  .trim()
                if (duration && currentGameText) {
                  currentGameText = `${currentGameText} ~ ${duration}`
                }

                if (!currentGameText) {
                  if (player.auction_timer_started_at) {
                    const startDate = new Date(player.auction_timer_started_at)
                    const now = new Date()
                    const diff = now.getTime() - startDate.getTime()
                    const minutes = Math.floor(diff / 60000)
                    currentGameText = `Аук идет ${minutes} мин`
                  } else {
                    currentGameText = '<Ожидание аука>'
                  }
                }

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
                            borderColor: getPlayerColor(player.url_handle),
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link to={`/players/${player.url_handle}`}>
                        <LinkSpan color={getPlayerColor(player.url_handle)}>
                          {displayName}
                        </LinkSpan>
                      </Link>
                    </TableCell>
                    <TableCell>{playerStat.map_position}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          <span>
                            Короткие игры: {shortGames} x{' '}
                            {scoreDetails.shortGamesMultiplier} <br />
                            Средние игры: {scoreDetails.mediumGames} x{' '}
                            {scoreDetails.mediumGamesMultiplier} <br />
                            Длинные игры: {scoreDetails.longGames} x{' '}
                            {scoreDetails.longGamesMultiplier} <br />
                            Дропы: {scoreDetails.drops} <br />
                            Шейх-дропы: {scoreDetails.shekhs} <br />
                            Ряд: {scoreDetails.row} <br />
                            Очки:{' ('}
                            {shortGames * scoreDetails.shortGamesMultiplier}
                            {' + '}
                            {scoreDetails.mediumGames *
                              scoreDetails.mediumGamesMultiplier}
                            {' + '}
                            {scoreDetails.longGames *
                              scoreDetails.longGamesMultiplier}
                            {' - '}
                            {scoreDetails.drops}
                            {' - '}
                            {scoreDetails.shekhs}
                            {') x '}
                            {scoreDetails.row}
                          </span>
                        }
                      >
                        <span>{score}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{playerStat.games_completed}</TableCell>
                    <TableCell>{playerStat.games_dropped}</TableCell>
                    <TableCell>{playerStat.rerolls}</TableCell>
                    <TableCell>{playerStat.movies}</TableCell>
                    <TableCell>{playerStat.sheikh_moments}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          <span>
                            {currentGameText} <br />
                            Категория стрима: {player.stream_last_category}
                          </span>
                        }
                      >
                        <Link
                          to={playerStream}
                          rel="noopener noreferrer"
                          target="_blank"
                          style={{
                            display: 'flex',
                          }}
                        >
                          <LinkSpan
                            color={getPlayerColor(player.url_handle)}
                            hideUnderline={!player?.is_online}
                            style={{
                              maxWidth: '285px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: player?.is_online
                                ? 'white'
                                : Color.greyText,
                            }}
                          >
                            {currentGameText}
                          </LinkSpan>
                        </Link>
                      </Tooltip>
                    </TableCell>
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

export function getPlayerScore(player: PlayerStats) {
  const details = getScoreDetails(player)

  const tinyGamesScore = details.tinyGames * details.tinyGamesMultiplier
  const shortGamesScore = details.shortGames * details.shortGamesMultiplier
  const mediumGamesScore = details.mediumGames * details.mediumGamesMultiplier
  const longGamesScore = details.longGames * details.longGamesMultiplier

  return (
    (shortGamesScore +
      tinyGamesScore +
      mediumGamesScore +
      longGamesScore -
      details.drops -
      details.shekhs) *
    details.row
  )
}

function getScoreDetails(stats: PlayerStats) {
  const shortGames = stats.short_games || 0
  const mediumGames = stats.medium_games || 0
  const longGames = stats.long_games || 0
  const tinyGames = stats.tiny_games || 0

  const row = Math.ceil(stats.map_position / 10)

  return {
    row,
    shortGames,
    shortGamesMultiplier: 1,
    tinyGames,
    tinyGamesMultiplier: 1,
    mediumGames,
    mediumGamesMultiplier: 1.5,
    longGames,
    longGamesMultiplier: 2,
    drops: stats.games_dropped,
    shekhs: stats.sheikh_moments,
  }
}
