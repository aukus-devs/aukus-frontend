export type Player = {
  id: number
  name: string
  twitch_stream_link: string
  vk_stream_link: string
  kick_stream_link: string
  donation_link: string
  telegram_link: string
  is_online: boolean
  current_game: string | null
  current_game_updated_at: string
  current_game_image: string | null
  url_handle: PlayerUrl
  map_position: number
  stream_last_category: string
  first_name: string
  last_name: string
  online_count?: number
}

export type PlayerStats = {
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
  tiny_games?: number
  short_games?: number
  medium_games?: number
  long_games?: number
}

export type MoveType = 'completed' | 'drop' | 'sheikh' | 'reroll' | 'movie'

export type DiceOption = '1d6' | '2d6' | '3d6' | '1d8' | '1d4'
export type DiceOrSkip = DiceOption | 'skip'

export type ItemLength = 'tiny' | 'short' | 'medium' | 'long'

export type PlayerMove = {
  id: number
  player_id: number
  created_at: string
  dice_roll: number
  cell_from: number
  cell_to: number
  stair_from: number | null
  stair_to: number | null
  snake_from: number | null
  snake_to: number | null
  type: MoveType
  item_title: string
  item_review: string
  item_rating: number
  item_image: string | null
  item_length: ItemLength | null
  vod_link: string | null
  player_move_id: number
  stream_title_category_duration: number | string
}

export type PlayerMoveRequest = {
  player_id: number
  dice_roll: number
  move_to: number
  stair_from: number | null
  stair_to: number | null
  snake_from: number | null
  snake_to: number | null
  type: MoveType
  item_title: string
  item_review: string
  item_rating: number
  item_length: ItemLength | null
}

export type NextTurnParams = {
  diceRoll: number
  stairFrom: number | null
  stairTo: number | null
  snakeFrom: number | null
  snakeTo: number | null
  type: MoveType
  itemTitle: string
  itemReview: string
  itemRating: number
  itemLength: ItemLength | null
}

export type MoveParams = {
  steps: number
  skipLadders: boolean
}

export type Page = 'map' | 'players' | 'player' | 'about' | 'rules' | 'stats'

export const Color = {
  greyLight: '#414141',
  greyDark: '#222222',
  greyDarkest: '#121212',
  greyNew: '#CECECE',
  greyText: '#656565',
  red: '#ff3b30',
  green: '#34C759',
  greenLight: '#00B88C',
  purple: '#AF52DE',
  blue: '#007AFF',
  blueDark: '#5856D6',
  blueLight: '#32ADE6',
  brown: '#A2845E',
  orange: '#E58600',
  pink: '#FF2D55',
  pinkLight: '#ECA3D4',
  white: '#FFFFFF',
  blueTg: '#27a7e7',
  biege: '#AF99DF',
  yellow: '#F2C200',
}

type CustomColorNames = `custom${Capitalize<keyof typeof Color>}`

export type CustomColorOverrides = {
  [K in keyof typeof Color as CustomColorNames]: true
}

export type PlayerUrl =
  | 'lasqa'
  | 'segall'
  | 'praden'
  | 'predan'
  | 'browjey'
  | 'uselessmouth'
  | 'roadhouse'
  | 'melharucos'
  | 'maddyson'
  | 'krabick'
  | 'vovapain'
  | 'timofey'
  | 'keliq_q'
  | 'unclebjorn'

export const ColorByUrlHandle: { [key in PlayerUrl]: string } = {
  lasqa: Color.blue,
  segall: Color.green,
  praden: Color.brown,
  predan: Color.brown,
  browjey: Color.orange,
  uselessmouth: Color.pink,
  roadhouse: Color.purple,
  melharucos: Color.blueLight,
  maddyson: Color.yellow,
  krabick: Color.blueDark,
  vovapain: Color.red,
  timofey: Color.greenLight,
  keliq_q: Color.biege,
  unclebjorn: Color.pinkLight,
}

export const ColorNameByUrlHandle: {
  [key in PlayerUrl]: CustomColorNames
} = {
  lasqa: 'customBlue',
  segall: 'customGreen',
  praden: 'customBrown',
  predan: 'customBrown',
  browjey: 'customOrange',
  uselessmouth: 'customPink',
  roadhouse: 'customPurple',
  melharucos: 'customBlueLight',
  maddyson: 'customYellow',
  krabick: 'customBlueDark',
  vovapain: 'customRed',
  timofey: 'customGreenLight',
  keliq_q: 'customBiege',
  unclebjorn: 'customPinkLight',
}

export function getPlayerColor(urlHandle: PlayerUrl): string {
  return ColorByUrlHandle[urlHandle] || Color.blueLight
}

export function getPlayerColorName(player: Player): CustomColorNames {
  return ColorNameByUrlHandle[player.url_handle] || 'customBlueLight'
}

export type CurrentUser = {
  user_id: number
  role: 'player' | 'moder' | 'admin'
  moder_for?: number
  url_handle: PlayerUrl | null
  name: string
}
