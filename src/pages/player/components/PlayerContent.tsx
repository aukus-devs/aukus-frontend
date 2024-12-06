import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import SearchIcon from 'assets/search-normal.svg?react'
import LinkSpan from 'components/LinkSpan'
import { PlayerCanvasBackground } from 'components/PlayerCanvasBackground'
import { useUser } from 'context/UserProvider'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPlayerMoves, fetchPlayers } from 'utils/api'
import { Color, getPlayerColor } from 'utils/types'
import { aukus1Games } from '../data_aukus1'
import { aukus2Games } from '../data_aukus2'
import MoveCard from './MoveCard'
import OldMoveCard from './OldMoveCard'
import StreamLink from './StreamLink'
import useScreenSize from 'src/context/useScreenSize'
import CurrentMove from './CurrentMove'
import { hasEditPermission, playerDisplayName } from './utils'

export default function PlayerContent() {
  const { id: playerHandle } = useParams()
  const [fetchStart] = useState(Date.now())
  const [filter, setFilter] = useState('')

  const { isMobile } = useScreenSize()

  const currentUser = useUser()

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    staleTime: 1000 * 60 * 1,
  })
  const players = playersData?.players
  const player = players?.find((player) => player.url_handle === playerHandle)

  const { data: playerMovesData } = useQuery({
    queryKey: ['playerMoves', player?.id || 0],
    queryFn: () => player && fetchPlayerMoves({ id: player.id }),
    staleTime: 1000 * 60 * 1,
    enabled: !!player,
  })

  const playerMoves = playerMovesData?.moves

  if (!playersData || !playerMovesData) {
    if (Date.now() - fetchStart > 1000) {
      return <div>Загрузка</div>
    }
    return null
  }

  if (!player || playerMoves === undefined) {
    return <div>Игрок не найден</div>
  }

  const isOwner = player.id === currentUser?.user_id
  const canEdit = hasEditPermission(currentUser, player.id)

  playerMoves.sort((a, b) => {
    return b.id - a.id
  })

  const playerColor = getPlayerColor(player.url_handle)

  const translitFilter = transliterateRussianToEnglishVariants(
    filter.toLowerCase()
  )
  const hasFilter = translitFilter[0].length > 0

  let filteredMoves = playerMoves
  if (hasFilter) {
    filteredMoves = playerMoves.filter((move) => {
      return translitFilter.some((ftext) =>
        move.item_title.toLowerCase().includes(ftext)
      )
    })
  }

  const aukus1games = aukus1Games[player.url_handle]
  let aukus1FilteredGames = aukus1games?.games
  if (hasFilter && aukus1FilteredGames) {
    aukus1FilteredGames = aukus1games.games.filter((game) => {
      return translitFilter.some((ftext) =>
        game.title.toLowerCase().includes(ftext)
      )
    })
  }

  const aukus2games = aukus2Games[player.url_handle]
  let aukus2FilteredGames = aukus2games?.games
  if (hasFilter && aukus2FilteredGames) {
    aukus2FilteredGames = aukus2games.games.filter((game) => {
      return translitFilter.some((ftext) =>
        game.title.toLowerCase().includes(ftext)
      )
    })
  }

  const displayName = playerDisplayName(player)

  return (
    <Box>
      <PlayerCanvasBackground
        player={player}
        canEdit={canEdit}
        isOwner={isOwner}
      >
        <Box zIndex={5} position={'relative'}>
          <Box marginTop={'100px'}>
            <Box textAlign={'center'}>
              <Typography fontSize="48px" fontWeight={700}>
                {player.first_name} «{displayName}»
              </Typography>
              <Box marginTop={'30px'} marginBottom={'50px'}>
                <StreamLink player={player} />
              </Box>
              <Box
                marginBottom={'30px'}
                marginLeft={'10px'}
                marginRight={'10px'}
              >
                <TextField
                  placeholder="Поиск среди всех игр Аукусов, например: Witcher, Вичер"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color={'#8e8e8e'} />
                      </InputAdornment>
                    ),
                    className: 'customSearch',
                    style: {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      paddingLeft: '10px',
                      height: '39px',
                    },
                  }}
                  style={{
                    width: isMobile ? '100%' : '800px',
                    fontSize: '16px important!',
                    backgroundColor: Color.greyDark,
                    borderRadius: '10px',
                    borderColor: Color.greyDark,
                  }}
                />
              </Box>

              {player.current_game && !filter && (
                <CurrentMove
                  id={playerMoves.length + 1}
                  title={
                    player.current_game ||
                    '<Для автоматического обновления привяжи PointAuc>'
                  }
                  player={player}
                  updatedAt={player.current_game_updated_at}
                  canEdit={canEdit}
                />
              )}

              {filteredMoves.map((move, index) => {
                return (
                  <Box key={index}>
                    <MoveCard
                      player={player}
                      id={playerMoves.length - index}
                      move={move}
                      displayType="player"
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>

          {aukus2FilteredGames && (
            <Box marginTop={filter ? '50px' : '200px'}>
              <Typography fontSize={'24px'} fontWeight={600} align="center">
                <Link
                  to={aukus2games.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <LinkSpan color={playerColor}>Аукус Сезон 2 (2023)</LinkSpan>
                </Link>
              </Typography>

              <Box marginBottom={'50px'} />

              {aukus2FilteredGames.map((game, index) => (
                <Fragment key={index}>
                  <OldMoveCard id={index + 1} game={game} />
                </Fragment>
              ))}
            </Box>
          )}

          {aukus1FilteredGames && (
            <Box marginTop={filter ? '50px' : '200px'}>
              <Typography fontSize={'24px'} fontWeight={600} align="center">
                <Link
                  to={aukus1games.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <LinkSpan color={playerColor}>Аукус Сезон 1 (2022)</LinkSpan>
                </Link>
              </Typography>

              <Box marginBottom={'50px'} />

              {aukus1FilteredGames.map((game, index) => (
                <Fragment key={index}>
                  <OldMoveCard id={index + 1} game={game} />
                </Fragment>
              ))}
            </Box>
          )}
        </Box>
      </PlayerCanvasBackground>
    </Box>
  )
}

// Mapping of Russian characters to arrays of phonetically similar English characters (lowercase only)
const transliterationMap: { [key: string]: string[] } = {
  а: ['a', 'u', 'ia'],
  б: ['b', 'v'],
  в: ['v', 'w'],
  г: ['g', 'h'],
  д: ['d', 'j'],
  е: ['e', 'ye', 'a'],
  ё: ['yo', 'io'],
  ж: ['zh', 'j'],
  з: ['z', 's'],
  и: ['i', 'y', 'ee'],
  й: ['y'],
  к: ['k', 'c'],
  л: ['l'],
  м: ['m'],
  н: ['n'],
  о: ['o'],
  п: ['p'],
  р: ['r'],
  с: ['s'],
  т: ['t'],
  у: ['u', 'oo'],
  ф: ['f', 'v'],
  х: ['kh', 'h', 'ch'],
  ц: ['ts', 'c'],
  ч: ['ch', 'tch'],
  ш: ['sh'],
  щ: ['shch'],
  ы: ['y', 'i'],
  э: ['e', 'a'],
  ю: ['yu', 'iu'],
  я: ['ya', 'ia'],
}

// Recursive function to generate all combinations of transliterated strings
function generateCombinations(
  variants: string[][],
  index: number,
  current: string,
  results: string[]
) {
  if (index === variants.length) {
    results.push(current)
    return
  }

  // Loop through all possible phonetic variants for the current character
  for (const variant of variants[index]) {
    generateCombinations(variants, index + 1, current + variant, results)
  }
}

// Function to transliterate a Russian string to all possible phonetically similar English strings
function transliterateRussianToEnglishVariants(russianText: string): string[] {
  const results: string[] = []
  const variants: string[][] = []

  // Convert Russian text into arrays of possible phonetic matches
  for (const char of russianText.toLocaleLowerCase().split('')) {
    const variant = transliterationMap[char]
    if (variant) {
      variants.push([char, ...variant])
    } else {
      variants.push([char])
    }
  }

  // Generate all possible combinations of the transliterations
  generateCombinations(variants, 0, '', results)

  return results
}
