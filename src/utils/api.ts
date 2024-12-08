import times from 'lodash/times'
import { playerMovesMock, playersMock, playerStatsMock } from './mocks'
import {
  CurrentUser,
  Player,
  PlayerMove,
  PlayerMoveRequest,
  PlayerStats,
} from './types'

const MOCK_API = process.env.NODE_ENV === 'development'

type PlayersResponse = {
  players: Array<Player>
}

export async function fetchPlayers(move_id?: number): Promise<PlayersResponse> {
  if (MOCK_API) {
    console.log('fetching players', move_id)
    return Promise.resolve({ players: playersMock })
  }
  if (move_id) {
    return fetch(`/api/players?move_id=${move_id}`).then((res) => res.json())
  }
  return fetch(`/api/players`).then((res) => res.json())
}

export async function createPlayerMove(move: PlayerMoveRequest): Promise<void> {
  if (MOCK_API) {
    console.log('creating player move', move)
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

export async function fetchCurrentUser(): Promise<CurrentUser> {
  if (MOCK_API) {
    console.log('fetching current user')
    // return Promise.reject({ error: 'auth required' })
    return Promise.resolve({
      user_id: 1,
      role: 'player',
      moder_for: undefined,
      url_handle: 'lasqa',
      name: 'Lasqa',
    })
  }
  return fetch(`/api/current_user`).then((res) => {
    if (res.status !== 200) {
      throw new Error('auth required')
    }
    return res.json()
  })
}

type StatsResponse = {
  players: Array<PlayerStats>
}

export async function fetchStats(): Promise<StatsResponse> {
  if (MOCK_API) {
    console.log('fetching stats')
    return Promise.resolve({
      players: playerStatsMock(),
    })
  }
  return fetch(`/api/player_stats`).then((res) => res.json())
}

type Game = {
  gameName: string
  box_art_url: string
}

type GamesResponse = {
  games: Game[]
}

export async function fetchGameNames(name: string): Promise<GamesResponse> {
  if (MOCK_API) {
    console.log('fetching game names', name)
    return Promise.resolve({
      games: [
        {
          gameName: `Worms 3d`,
          box_art_url: `https://static-cdn.jtvnw.net/ttv-boxart/${1}-{width}x{height}.jpg`,
          id: 1,
        },
        {
          gameName: `Earthworm Jim`,
          box_art_url: `https://static-cdn.jtvnw.net/ttv-boxart/${2}-{width}x{height}.jpg`,
          id: 2,
        },
        {
          gameName: `Worms World Party`,
          box_art_url: `https://static-cdn.jtvnw.net/ttv-boxart/${3}-{width}x{height}.jpg`,
          id: 3,
        },
        {
          gameName: `Worms Armageddon`,
          box_art_url: `https://static-cdn.jtvnw.net/ttv-boxart/${4}-{width}x{height}.jpg`,
          id: 4,
        },
      ],
    })
  }

  return fetch(`/api/games?title=${name}`).then((res) => res.json())
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
  if (MOCK_API) {
    console.log('setting vod link', link)
    return Promise.resolve()
  }
  return fetch(`/api/player_move_vod_link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ move_id, vod_link: link, title }),
  }).then((res) => res.json())
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
  if (MOCK_API) {
    console.log('fetching player moves', id)
    return Promise.resolve({ moves: playerMovesMock() })
  }
  if (id) {
    return fetch(`/api/moves?player_id=${id}`).then((res) => res.json())
  }
  if (date) {
    return fetch(`/api/moves?date=${date}`).then((res) => res.json())
  }
  return fetch(`/api/moves?limit=${limit || 10}`).then((res) => res.json())
}

type ResetPointaucTokenResponse = {
  token: string
}

export async function resetPointaucToken(): Promise<ResetPointaucTokenResponse> {
  if (MOCK_API) {
    console.log('resetting token')
    return Promise.resolve({ token: 'xxx' })
  }
  return fetch('/api/reset_pointauc_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

type UpdateCurrentGameParams = {
  player_id: number
  title: string
}

export async function updateCurrentGame({
  player_id,
  title,
}: UpdateCurrentGameParams): Promise<void> {
  if (MOCK_API) {
    console.log('updating current game', player_id, title)
    return Promise.resolve()
  }
  return fetch(`/api/player_current_game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player_id, title }),
  }).then((res) => res.json())
}

type Sponsor = {
  name: string
  text?: string
  type: 'big' | 'small'
}

type SponsorsResponse = {
  dons: Sponsor[]
}

export async function fetchSponsors(): Promise<SponsorsResponse> {
  if (MOCK_API) {
    return Promise.resolve({
      dons: [
        {
          name: 'Юзя',
          type: 'big',
          text: 'а я еще дам деняк на пиво (или не на пиво)',
        },
        {
          name: 'CruxTerminatus',
          type: 'big',
          text: 'а я еще дам деняк на пиво (или не на пиво)',
        },
        { name: 'Tsessarsky', type: 'small', text: 'Спасибо за ивент!' },
      ],
    })
  }
  return fetch('/api/dons').then((res) => res.json())
}
