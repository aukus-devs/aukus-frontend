import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import {
  Color,
  DiceOption,
  DiceOrSkip,
  ItemLength,
  MoveType,
  NextTurnParams,
  Player,
} from 'src/utils/types'
import { CustomPopper, MenuItemStyled } from '../action/TurnModal'
import { Link } from 'react-router-dom'
import NumRating from '../action/NumRating'
import { useCallback, useEffect, useState } from 'react'
import useLocalStorage from 'src/context/useLocalStorage'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'
import { KeyboardArrowDownSharp } from '@mui/icons-material'
import { checkImageValid } from '../utils'
import { useQuery } from '@tanstack/react-query'
import { fetchGameNames } from 'src/utils/api'
import debounce from 'lodash/debounce'

type Props = {
  player: Player
  onFinished: (params: NextTurnParams, dice: DiceOrSkip) => void
  onClose: () => void
}

export default function GameReviewForm({ player, onFinished, onClose }: Props) {
  const { value: savedReview, save: saveReview } = useLocalStorage({
    key: 'item_review',
    defaultValue: '',
  })

  const [rating, setRating] = useState<number | null>(null)
  const [ratingHover, setRatingHover] = useState<number | null>(null)
  const [gameName, setGameName] = useState(player.current_game || '')
  const [debouncedGameName, setDebouncedGameName] = useState('')
  const [review, setReview] = useState<string>(savedReview)
  const [gameHours, setGameHours] = useState<ItemLength | null>(null)
  const [moveType, setMoveType] = useState<MoveType | null>(null)
  const [gameImage, setGameImage] = useState<string | null>(null)

  const debounceGameName = useCallback(
    debounce((value: string) => {
      setDebouncedGameName(value)
    }, 100),
    []
  )

  const saveReviewDebounced = useCallback(
    debounce((value: string) => {
      saveReview(value)
    }, 100),
    []
  )

  useEffect(() => {
    debounceGameName(gameName)
    return () => {
      debounceGameName.cancel()
    }
  }, [gameName])

  useEffect(() => {
    if (player.current_game) {
      setGameName(player.current_game)
    }
    setGameImage(null)
  }, [player.current_game])

  const { data: gameNamesData } = useQuery({
    queryKey: ['game_names_action_modal', debouncedGameName],
    queryFn: () => fetchGameNames(debouncedGameName),
    enabled: debouncedGameName.length > 3,
    staleTime: 1000 * 60 * 60,
  })

  let gameNameOptions: string[] = []
  if (gameName.length > 3 && gameNamesData && moveType !== 'movie') {
    gameNameOptions = gameNamesData.games.map((game) => game.gameName)
    // sort game name options by position of matching gameName
    gameNameOptions.sort((a, b) => {
      const lowerGameName = gameName.toLowerCase()
      const aIndex = a.toLowerCase().indexOf(lowerGameName)
      const bIndex = b.toLowerCase().indexOf(lowerGameName)

      // Items with earlier matches come first
      if (aIndex !== bIndex) {
        if (aIndex === -1) return 1 // No match for 'a'
        if (bIndex === -1) return -1 // No match for 'b'
        return aIndex - bIndex // Compare positions
      }

      // If match positions are equal or both don't match, maintain original order
      return 0
    })
  }

  let formattedGameName = gameName?.replace(/\s\(\d{4}\)$/, '').trim()
  const hltbLink = `https://howlongtobeat.com/?q=${formattedGameName}`

  useEffect(() => {
    if (
      gameNamesData &&
      gameNamesData.games.length > 0 &&
      gameName.length > 3
    ) {
      const exactGameUrl = gameNamesData.games.find(
        (game) => game.gameName === gameName
      )?.box_art_url

      const firstOptionUrl = gameNamesData.games.find(
        (game) => game.gameName === gameNameOptions[0]
      )?.box_art_url

      const matchingUrl = exactGameUrl || firstOptionUrl
      if (matchingUrl) {
        const imageUrl = matchingUrl
          .replace('{width}', '200')
          .replace('{height}', '300')

        const validateImage = async (url: string) => {
          const isValid = await checkImageValid(url)
          setGameImage(isValid ? url : null)
        }

        validateImage(imageUrl)
      }
    } else {
      setGameImage(null) // No game data
    }
  }, [gameNamesData?.games, gameName, gameNameOptions])

  const handleRatingChange = (
    _: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setRating(newValue)
  }

  const handleRatingChangeWhileHovering = (
    _: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setRatingHover(newValue)
  }

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReview(event.target.value)
    saveReview(event.target.value)
  }

  const handleGameHoursChange = (newValue: ItemLength | null) => {
    setGameHours(newValue)
  }

  const handleMoveTypeChange = (event: SelectChangeEvent) => {
    setMoveType(event.target.value as MoveType)
  }

  const handleFinished = () => {
    const dice: DiceOrSkip | null = getDiceType({
      moveType,
      gameHours,
      playerPosition: player.map_position,
    })

    if (dice && moveType) {
      const params: NextTurnParams = {
        type: moveType,
        itemLength: gameHours,
        itemRating: rating || 0,
        itemReview: review,
        itemTitle: gameName,
        snakeFrom: null,
        snakeTo: null,
        stairFrom: null,
        stairTo: null,
        diceRoll: 0,
      }
      onFinished(params, dice)
    }
  }

  let displayRating = rating || 0
  if (ratingHover && ratingHover !== -1) {
    displayRating = ratingHover
  }

  const canWatchMovie = player.map_position !== 101
  const readyToWin = player.map_position === 101 && moveType === 'completed'

  let selectedItemColor = Color.green
  switch (moveType) {
    case 'completed':
      selectedItemColor = Color.green
      break
    case 'drop':
      selectedItemColor = Color.red
      break
    case 'reroll':
      selectedItemColor = Color.blue
      break
    case 'sheikh':
      selectedItemColor = Color.orange
      break
    case 'movie':
      selectedItemColor = Color.purple
      break
  }

  const timeSelectOptions: { [k in ItemLength]: string } = {
    tiny: '0-3 часов',
    short: '3-15 часов',
    medium: '15-30 часов',
    long: '30+ часов',
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="flex-start">
          <Box marginRight={'30px'}>
            {gameImage ? (
              <img
                src={gameImage}
                alt="game"
                style={{
                  width: '134px',
                  height: '201px',
                  borderRadius: '10px',
                }}
              />
            ) : (
              <ImagePlaceholder
                width={'134px'}
                height={'201px'}
                style={{ borderRadius: '10px' }}
              />
            )}
          </Box>
          <Box>
            <Autocomplete
              freeSolo
              fullWidth
              PopperComponent={CustomPopper}
              options={gameNameOptions}
              value={gameName}
              onChange={(_, newValue) => {
                setGameName(newValue || '')
              }}
              onInputChange={(_, newValue) => {
                setGameName(newValue)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontSize: '16px important!',
                  }}
                />
              )}
              sx={{
                marginTop: '10px',
                width: '100%',
              }}
              className={
                gameNameOptions.length > 0 ? 'has-options' : 'no-options'
              }
            />
            <FormControl size="small" sx={{ width: '320px' }}>
              {!moveType && (
                <InputLabel style={{ color: 'grey' }}>Действие</InputLabel>
              )}
              <Select
                onChange={handleMoveTypeChange}
                value={moveType ? moveType : ''}
                IconComponent={KeyboardArrowDownSharp}
                style={{ fontSize: '16px', fontWeight: 500 }}
                MenuProps={{
                  sx: {
                    '&& .Mui-selected': { backgroundColor: selectedItemColor },
                    fontSize: '16px',
                  },
                  transitionDuration: 0,
                  disableScrollLock: true,
                }}
                className="CustomSelect"
              >
                <MenuItemStyled value="completed" color={Color.green}>
                  Прошел игру
                </MenuItemStyled>
                <MenuItemStyled value="drop" color={Color.red}>
                  Дропнул игру
                </MenuItemStyled>
                <MenuItemStyled value="reroll" color={Color.blue}>
                  Реролл
                </MenuItemStyled>
                <MenuItemStyled value="sheikh" color={Color.orange}>
                  Шейх-момент (если прокнул дроп)
                </MenuItemStyled>
                {canWatchMovie && (
                  <MenuItemStyled value="movie" color={Color.purple}>
                    Посмотрел фильм
                  </MenuItemStyled>
                )}
              </Select>
            </FormControl>
            <Box display="flex">
              {moveType === 'completed' && (
                <>
                  <Link to={hltbLink} rel="noopener nereferrer" target="_blank">
                    <Button sx={{ height: '44px', marginRight: '15px' }}>
                      HLTB
                    </Button>
                  </Link>
                  <FormControl size="small" sx={{ width: '320px' }}>
                    {!moveType && (
                      <InputLabel style={{ color: 'grey' }}>
                        Действие
                      </InputLabel>
                    )}
                    <Select
                      displayEmpty
                      onChange={(e) =>
                        handleGameHoursChange(e.target.value as ItemLength)
                      }
                      value={gameHours ?? ''}
                      IconComponent={KeyboardArrowDownSharp}
                      style={{ fontSize: '16px', fontWeight: 500 }}
                      MenuProps={{
                        sx: {
                          // '&& .Mui-selected': {
                          //   backgroundColor: selectedItemColor,
                          // },
                          fontSize: '16px',
                        },
                        transitionDuration: 0,
                        disableScrollLock: true,
                      }}
                      className="CustomSelect"
                      renderValue={(value: ItemLength | '') => {
                        if (value === '') {
                          return 'Выбери время'
                        }
                        return timeSelectOptions[value]
                      }}
                    >
                      <MenuItemStyled value="tiny">
                        {timeSelectOptions.tiny}
                      </MenuItemStyled>
                      <MenuItemStyled value="short">
                        {timeSelectOptions.short}
                      </MenuItemStyled>
                      <MenuItemStyled value="medium">
                        {timeSelectOptions.medium}
                      </MenuItemStyled>
                      <MenuItemStyled value="long">
                        {timeSelectOptions.long}
                      </MenuItemStyled>
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Box marginTop={'30px'}>
          <span
            style={{ width: '110px', marginLeft: '15px', fontSize: '16px' }}
          >
            Оценка: {displayRating}
          </span>
          <NumRating
            precision={0.5}
            max={10}
            sx={{ marginLeft: '0px' }}
            onChange={handleRatingChange}
            onChangeActive={handleRatingChangeWhileHovering}
            value={rating}
          />
          <Box style={{ marginLeft: '15px', fontSize: '20px' }}>Отзыв</Box>
          <TextField
            sx={{ marginTop: '10px' }}
            InputProps={{
              style: {
                paddingTop: '10px',
                paddingLeft: '15px',
                paddingRight: '15px',
                paddingBottom: '10px',
                lineHeight: '1.2',
                fontSize: '16px',
                fontWeight: 500,
              },
            }}
            multiline
            fullWidth
            rows={4}
            value={review}
            onChange={handleReviewChange}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" position="relative">
        <Box position="absolute" left="0px">
          <Button color="customRed" onClick={onClose}>
            Закрыть
          </Button>
        </Box>
        <Button sx={{ width: '320px' }} onClick={handleFinished}>
          Перейти к броску
        </Button>
      </Box>
    </Box>
  )
}

type GetDiceTypeProps = {
  moveType: MoveType | null
  gameHours: ItemLength | null
  playerPosition: number
}

function getDiceType({
  moveType,
  gameHours,
  playerPosition,
}: GetDiceTypeProps) {
  if (!moveType) {
    return null
  }
  if (moveType === 'drop' || moveType === 'sheikh') {
    if (playerPosition >= 81) {
      return '2d6'
    }
    return '1d6'
  }
  if (moveType === 'completed' && gameHours) {
    if (playerPosition >= 81) {
      return '1d6'
    }
    switch (gameHours) {
      case 'tiny':
        return '1d6'
      case 'short':
        return '1d6'
      case 'medium':
        return '2d6'
      case 'long':
        return '3d6'
    }
  }
  if (moveType === 'movie') {
    return '1d4'
  }
  if (moveType === 'reroll') {
    return 'skip'
  }
  return null
}
