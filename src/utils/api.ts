import {
  CurrentUser,
  Player,
  PlayerMove,
  PlayerMoveRequest,
  PlayerStats,
} from './types'

type PlayersResponse = {
  players: Array<Player>
}

export async function fetchPlayers(move_id?: number): Promise<PlayersResponse> {
  console.log('fetching players from local JSON', move_id)
  const response = await fetch('/api/players.json')
  return response.json()
}

export async function createPlayerMove(move: PlayerMoveRequest): Promise<void> {
  console.log('creating player move (local mock)', move)
  return Promise.resolve()
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  throw new Error('Unauthorized')
}

type StatsResponse = {
  players: Array<PlayerStats>
}

export async function fetchStats(): Promise<StatsResponse> {
  console.log('fetching stats from local JSON')
  const response = await fetch('/api/player_stats.json')
  return response.json()
}

type Game = {
  gameName: string
  box_art_url: string
  id: number
}

type GamesResponse = {
  games: Game[]
}

export async function fetchGameNames(name: string): Promise<GamesResponse> {
  console.log('fetching game names from local JSON', name)
  const response = await fetch('/api/games.json')
  const data = await response.json()

  if (name) {
    const filteredGames = data.games.filter((game: Game) =>
      game.gameName.toLowerCase().includes(name.toLowerCase())
    )
    return { games: filteredGames }
  }

  return data
}

type UpdateLinkParams = {
  move_id: number
  link: string
  title: string
}

export async function updateVodLink({
  move_id,
  link,
  title,
}: UpdateLinkParams): Promise<void> {
  console.log('setting vod link (local mock)', link)
  return Promise.resolve()
}

export type PlayerMovesResponse = {
  moves: Array<PlayerMove>
  last_move_id?: number
}

type PlayerMovesParams = {
  id?: number
  date?: string
  limit?: number
}

export async function fetchPlayerMoves({
  id,
  date,
  limit,
}: PlayerMovesParams): Promise<PlayerMovesResponse> {
  console.log('fetching player moves from local JSON', id, date, limit)
  const response = await fetch('/api/moves.json')
  const data = await response.json()

  let filteredMoves = data.moves

  if (id) {
    filteredMoves = filteredMoves.filter((move: PlayerMove) => move.player_id === id)
  }

  if (date) {
    filteredMoves = filteredMoves.filter((move: PlayerMove) => {
      // Convert both dates to YYYY-MM-DD format for comparison
      const moveDate = new Date(move.created_at).toISOString().split('T')[0]
      return moveDate === date
    })
  }

  if (limit) {
    filteredMoves = filteredMoves.slice(0, limit)
  }

  return { moves: filteredMoves }
}

type ResetPointaucTokenResponse = {
  token: string
}

export async function resetPointaucToken(): Promise<ResetPointaucTokenResponse> {
  console.log('resetting token from local JSON')
  const response = await fetch('/api/reset_pointauc_token.json')
  return response.json()
}

type UpdateCurrentGameParams = {
  player_id: number
  title: string
}

export async function updateCurrentGame({
  player_id,
  title,
}: UpdateCurrentGameParams): Promise<void> {
  console.log('updating current game (local mock)', player_id, title)
  return Promise.resolve()
}

export type Sponsor = {
  name: string
  text?: string
  type: 'big' | 'small'
}

type SponsorsResponse = {
  dons: Sponsor[]
}

export async function fetchSponsors(): Promise<SponsorsResponse> {
  console.log('fetching sponsors from local JSON')
  const response = await fetch('/api/dons.json')
  return response.json()
}
