import { Close, KeyboardArrowDownSharp } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popper,
  PopperProps,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import { fetchGameNames } from 'utils/api'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'

import {
  Color,
  DiceOption,
  DiceOrSkip,
  ItemLength,
  MoveType,
  NextTurnParams,
  Player,
} from 'utils/types'
import NumRating from './NumRating'
import { isNumber } from 'lodash'
import { checkImageValid } from '../utils'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (params: NextTurnParams, dice: DiceOrSkip) => void
  player: Player
}

export default function TurnModal({ open, onClose, onConfirm, player }: Props) {
  const [rating, setRating] = useState<number | null>(null)
  const [ratingHover, setRatingHover] = useState<number | null>(null)
  const [gameName, setGameName] = useState(player.current_game || '')
  const [review, setReview] = useState('')
  const [gameHours, setGameHours] = useState<ItemLength | null>(null)
  const [moveType, setMoveType] = useState<MoveType | null>(null)
  const [gameImage, setGameImage] = useState<string | null>(null)

  useEffect(() => {
    if (player.current_game) {
      setGameName(player.current_game)
    }
    setGameImage(null)
  }, [player.current_game])

  const {
    data: gameNamesData,
    dataUpdatedAt: updateTs,
    refetch,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ['game_names_action_modal'],
    queryFn: () => fetchGameNames(gameName),
    enabled: gameName.length > 3 && moveType !== 'movie',
  })

  useEffect(() => {
    if (
      status !== 'pending' &&
      fetchStatus === 'idle' &&
      gameName.length > 3 &&
      updateTs + 500 < Date.now()
    ) {
      refetch()
    }
  }, [gameName.length, status, fetchStatus, updateTs, refetch])

  let gameNameOptions: string[] = []
  if (gameName.length > 3 && gameNamesData && moveType !== 'movie') {
    gameNameOptions = gameNamesData.games.map((game) => game.gameName)
  }

  useEffect(() => {
    if (
      gameNamesData &&
      gameNamesData.games.length > 0 &&
      gameName.length > 3
    ) {
      const matchingUrl =
        gameNamesData.games.find((game) => game.gameName === gameName)
          ?.box_art_url || gameNamesData.games[0].box_art_url

      const imageUrl = matchingUrl
        .replace('{width}', '200')
        .replace('{height}', '300')

      const validateImage = async (url: string) => {
        const isValid = await checkImageValid(url)
        setGameImage(isValid ? url : null)
      }

      validateImage(imageUrl)
    } else {
      setGameImage(null) // No game data
    }
  }, [gameNamesData?.games, gameName])

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
  }

  const handleGameHoursChange = (newValue: ItemLength | null) => {
    setGameHours(newValue)
  }

  const handleMoveTypeChange = (event: SelectChangeEvent) => {
    setMoveType(event.target.value as MoveType)
  }

  const dice: DiceOrSkip | null = getDiceType({
    moveType,
    gameHours,
    playerPosition: player.map_position,
  })

  const gameFieldsCompleted = gameName && dice
  const reviewCompleted = review !== '' && rating !== null

  let canThrowDice = false
  if (gameFieldsCompleted) {
    if (moveType === 'completed') {
      canThrowDice = reviewCompleted
    } else if (moveType === 'movie') {
      canThrowDice = reviewCompleted
    } else {
      canThrowDice = true
    }
  }

  const handleConfirmTurn = () => {
    if (moveType && dice !== null) {
      onConfirm(
        {
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
        },
        dice
      )
      setRating(null)
      setRatingHover(null)
      setGameName('')
      setReview('')
      setGameHours(null)
      setMoveType(null)
    }
  }

  const handleClose = () => {
    onClose()
  }

  let displayRating = rating || 0
  if (ratingHover && ratingHover !== -1) {
    displayRating = ratingHover
  }

  const canWatchMovie = player.map_position !== 101
  const readyToWin = player.map_position === 101 && moveType === 'completed'

  let buttonText = 'Перейти к броску'
  if (moveType === 'reroll') {
    buttonText = 'Рерольнуть игру'
  } else if (dice) {
    buttonText = `Перейти к броску — ${dice}`
  }

  if (readyToWin) {
    buttonText = 'Победить в Аукусе 2024'
  }

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

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="md"
      keepMounted
      sx={{ fontWeight: 500 }}
    >
      <DialogTitle
        sx={{
          paddingTop: '30px',
          paddingBottom: '30px',
          paddingLeft: '30px',
          paddingRight: '30px',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography fontSize={'24px'} fontWeight={600} lineHeight={1}>
            Новый ход
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              padding: 0,
              color: 'white',
            }}
          >
            <Close sx={{ fontSize: '29px' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: 0 }}
      >
        <FormControl size="small" fullWidth>
          {!moveType && (
            <InputLabel style={{ color: 'grey' }}>Действие</InputLabel>
          )}
          <Select
            onChange={handleMoveTypeChange}
            value={moveType ? moveType : ''}
            IconComponent={KeyboardArrowDownSharp}
            sx={{ fontSize: '16px', fontWeight: 500 }}
            MenuProps={{
              sx: {
                '&& .Mui-selected': { backgroundColor: selectedItemColor },
                fontSize: '16px',
              },
              transitionDuration: 0,
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
              Шейх-момент
            </MenuItemStyled>
            {canWatchMovie && (
              <MenuItemStyled value="movie" color={Color.purple}>
                Посмотрел фильм
              </MenuItemStyled>
            )}
          </Select>
        </FormControl>

        <Box marginTop={'30px'} lineHeight={1} display={'flex'}>
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
          <Box width={'100%'}>
            <span style={{ marginLeft: '15px', fontSize: '20px' }}>
              {moveType === 'movie' ? 'Фильм' : 'Игра'}
            </span>
            <Autocomplete
              freeSolo
              fullWidth
              PopperComponent={CustomPopper}
              options={gameNameOptions}
              value={gameName}
              onChange={(_, newValue) => {
                setGameName(newValue || '')
              }}
              renderInput={(params) => (
                <TextField
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setGameName(event.target.value)}
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
                width: '420px',
              }}
              className={
                gameNameOptions.length > 0 ? 'has-options' : 'no-options'
              }
            />
            <Box marginTop={'20px'}>
              {moveType === 'completed' && (
                <>
                  <Box display="flex" justifyContent={'center'}>
                    <Tooltip title="Нельзя подниматься по лестницам">
                      <Button
                        onClick={() => handleGameHoursChange('tiny')}
                        variant={
                          gameHours === 'tiny' ? 'contained' : 'outlined'
                        }
                        color={gameHours === 'tiny' ? 'secondary' : 'info'}
                        style={{
                          width: '200px',
                          height: '44px',
                          fontSize: '16px',
                          border:
                            gameHours === 'tiny'
                              ? '2px solid transparent'
                              : `2px solid ${Color.greyLight}`,
                          paddingTop: '5px',
                          paddingBottom: '5px',
                          paddingLeft: '15px',
                          paddingRight: '15px',
                        }}
                      >
                        0-3 часов
                      </Button>
                    </Tooltip>
                    <Button
                      onClick={() => handleGameHoursChange('short')}
                      variant={gameHours === 'short' ? 'contained' : 'outlined'}
                      color={gameHours === 'short' ? 'secondary' : 'info'}
                      style={{
                        width: '200px',
                        height: '44px',
                        marginLeft: 20,
                        fontSize: '16px',
                        border:
                          gameHours === 'short'
                            ? '2px solid transparent'
                            : `2px solid ${Color.greyLight}`,
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                      }}
                    >
                      3-15 часов
                    </Button>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent={'center'}
                    marginTop={'15px'}
                  >
                    <Button
                      onClick={() => handleGameHoursChange('medium')}
                      variant={
                        gameHours === 'medium' ? 'contained' : 'outlined'
                      }
                      color={gameHours === 'medium' ? 'secondary' : 'info'}
                      style={{
                        // marginLeft: 20,
                        width: '200px',
                        height: '44px',
                        fontSize: '16px',
                        border:
                          gameHours === 'medium'
                            ? '2px solid transparent'
                            : `2px solid ${Color.greyLight}`,
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                      }}
                    >
                      15-30 часов
                    </Button>
                    <Button
                      onClick={() => handleGameHoursChange('long')}
                      variant={gameHours === 'long' ? 'contained' : 'outlined'}
                      color={gameHours === 'long' ? 'secondary' : 'info'}
                      style={{
                        marginLeft: 20,
                        width: '200px',
                        height: '44px',
                        fontSize: '16px',
                        border:
                          gameHours === 'long'
                            ? '2px solid transparent'
                            : `2px solid ${Color.greyLight}`,
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                      }}
                    >
                      30+ часов
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Box marginTop={'30px'} display="flex">
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
        </Box>
        <Box marginTop={'28px'}>
          <span style={{ marginLeft: '15px', fontSize: '20px' }}>Отзыв</span>
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
      </DialogContent>
      <DialogActions
        sx={{
          paddingTop: '50px',
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
        }}
      >
        <Button
          fullWidth
          onClick={handleConfirmTurn}
          disabled={!canThrowDice}
          color="secondary"
          variant="contained"
          sx={{ fontSize: '16px', fontWeight: 700 }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
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

const MenuItemStyled = styled(MenuItem)(({ color }) => ({
  fontSize: '16px',
  fontWeight: 500,
  ':hover': {
    backgroundColor: `${color} !important`,
  },
}))

type CustomPopperProps = PopperProps & React.RefAttributes<HTMLDivElement>
export const CustomPopper = (props: CustomPopperProps) => {
  let width = props.style?.width ?? 0
  if (isNumber(width)) {
    width += 4
  }
  return (
    <Popper
      {...props}
      placement="bottom"
      style={{
        width,
      }}
    />
  )
}
