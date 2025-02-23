import { Box } from '@mui/material'
import { Player } from 'src/utils/types'
import { MapLadders, MapSnakes } from '../utils'
import { Ladder, Snake } from '../../types'
import { useMemo } from 'react'

type Props = {
  player: Player
}

export default function PlayerPanel({ player }: Props) {
  const moves = useMemo(() => generatePossibleMoves(player), [player])

  return (
    <Box>
      {moves.luckiestMove && (
        <Box>
          Самый рисковый ход: <MoveItem move={moves.luckiestMove} />
        </Box>
      )}
      {moves.safestMove && (
        <Box>
          Самый безопасный ход: <MoveItem move={moves.safestMove} />
        </Box>
      )}
      {moves.recommendedMove && (
        <Box>
          Рекомендуемый ход: <MoveItem move={moves.recommendedMove} />
        </Box>
      )}
    </Box>
  )
}

type MoveItemProps = {
  move: PossibleMove
}

function MoveItem({ move }: MoveItemProps) {
  const ladders = move.ladders.map((ladder) => ladder.cellFrom).join(', ')
  const snakes = move.snakes.map((snake) => snake.cellFrom).join(', ')

  const ladderChance = Math.round(move.ladderChance * 10) / 10
  const snakeChance = Math.round(move.snakeChance * 10) / 10

  return (
    <span>
      {move.type} на {move.dices} лестница: {ladderChance}% ({ladders}), змейка{' '}
      {snakeChance}% ({snakes})
    </span>
  )
}

type PossibleMove = {
  type: 'completed' | 'drop' | 'movie'
  dices: number
  ladders: Ladder[]
  ladderChance: number
  snakes: Snake[]
  snakeChance: number
  maxPotentialPosition: number
  minPotentialPosition: number
}

function generatePossibleMoves(player: Player) {
  let maxDicesForward = 3
  let maxDicesBackward = 1

  if (player.map_position >= 81) {
    maxDicesForward = 1
    maxDicesBackward = 2
  }

  const movesForward: PossibleMove[] = []
  const movesBackward: PossibleMove[] = []

  for (let i = 1; i <= maxDicesForward; i++) {
    const finalPos = player.map_position + i * 6

    const ladders = MapLadders.filter(
      (ladder) =>
        ladder.cellFrom > player.map_position && ladder.cellFrom <= finalPos
    )
    const ladderChance =
      ladders.length === 0 ? 0 : (ladders.length * 100) / (i * 6)

    const maxPotentialPosition = ladders.reduce(
      (max, ladder) => Math.max(max, ladder.cellTo),
      finalPos
    )

    const snakes = MapSnakes.filter(
      (snake) =>
        snake.cellFrom > player.map_position && snake.cellFrom <= finalPos
    )
    const snakeChance =
      snakes.length === 0 ? 0 : (snakes.length * 100) / (i * 6)

    const minPotentialPosition = snakes.reduce(
      (min, snake) => Math.min(min, snake.cellTo),
      player.map_position + 1 * i
    )

    movesForward.push({
      type: 'completed',
      dices: i,
      ladders,
      ladderChance,
      snakes,
      snakeChance,
      maxPotentialPosition,
      minPotentialPosition,
    })
  }

  for (let i = 1; i <= maxDicesBackward; i++) {
    const ladders = MapLadders.filter(
      (ladder) =>
        ladder.cellFrom < player.map_position &&
        ladder.cellFrom >= player.map_position - i * 6
    )
    const ladderChance =
      ladders.length === 0 ? 0 : (ladders.length * 100) / (i * 6)

    const snakes = MapSnakes.filter(
      (snake) =>
        snake.cellFrom < player.map_position &&
        snake.cellFrom >= player.map_position - i * 6
    )
    const snakeChance =
      snakes.length === 0 ? 0 : (snakes.length * 100) / (i * 6)

    const maxPotentialPosition = ladders.reduce(
      (max, ladder) => Math.max(max, ladder.cellTo),
      player.map_position - 1 * i
    )

    const minPotentialPosition = snakes.reduce(
      (min, snake) => Math.min(min, snake.cellTo),
      player.map_position - 6 * i
    )

    movesBackward.push({
      type: 'drop',
      dices: i,
      ladders,
      ladderChance,
      snakes,
      snakeChance,
      maxPotentialPosition,
      minPotentialPosition,
    })
  }

  let safestMove: PossibleMove | null = null
  let luckiestMove: PossibleMove | null = null
  let recommendedMove: PossibleMove | null = null

  let recommendScore = 0

  const allMoves = [...movesBackward, ...movesForward]

  for (const move of allMoves) {
    if (
      move.type === 'completed' &&
      (!safestMove ||
        (move.snakeChance <= safestMove.snakeChance &&
          move.maxPotentialPosition > safestMove.maxPotentialPosition))
    ) {
      safestMove = move
    }
    if (
      !luckiestMove ||
      move.maxPotentialPosition > luckiestMove.maxPotentialPosition
    ) {
      luckiestMove = move
    }
    const score = move.ladderChance + (100 - move.snakeChance)
    if (!recommendedMove || recommendScore < score) {
      recommendedMove = move
      recommendScore = score
    }
  }

  return {
    safestMove,
    luckiestMove,
    recommendedMove,
    movesForward,
    movesBackward,
  }
}
