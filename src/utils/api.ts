import { playerMovesMock, playersMock, playerStatsMock } from './mocks'
import { Player, PlayerMove, PlayerMoveRequest } from './types'

const MOCK_API = process.env.NODE_ENV === 'development'

type PlayerMovesResponse = {
  moves: Array<PlayerMove>
}

export async function fetchPlayerMoves(
  id: number
): Promise<PlayerMovesResponse> {
  if (MOCK_API) {
    return Promise.resolve({ moves: playerMovesMock() })
  }
  return fetch(`/api/players/${id}`).then((res) => res.json())
}

type PlayersResponse = {
  players: Array<Player>
}

export async function fetchPlayers(): Promise<PlayersResponse> {
  if (MOCK_API) {
    return Promise.resolve({ players: playersMock })
  }
  return fetch(`/api/players`).then((res) => res.json())
}

export async function createPlayerMove(move: PlayerMoveRequest): Promise<void> {
  if (MOCK_API) {
    playersMock[move.player_id].map_position += move.dice_roll
    return Promise.resolve()
  }
  return fetch(`/api/player_move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(move),
  }).then((res) => res.json())
}

type CurrentUserIdResponse = {
  user_id: number
}

export async function fetchCurrentUser(): Promise<CurrentUserIdResponse> {
  if (MOCK_API) {
    return Promise.resolve({ user_id: playersMock[0].id })
  }
  return fetch(`/api/get_current_user_id`).then((res) => res.json())
}

type PlayerStats = {
  id: number
  map_position: number
  total_moves: number
  games_completed: number
  games_dropped: number
  sheikh_moments: number
  rerolls: number
  movies: number
  ladders: number
  snakes: number
}

type StatsResponse = {
  players: Array<PlayerStats>
}

export async function fetchStats(): Promise<StatsResponse> {
  if (MOCK_API) {
    return Promise.resolve({
      players: playerStatsMock(),
    })
  }
  return fetch(`/api/player_stats`).then((res) => res.json())
}
