import PlayerGreen from 'assets/map/PlayerGreen.webp'
import PlayerGreenLight from 'assets/map/PlayerGreenLight.webp'
import PlayerRed from 'assets/map/PlayerRed.webp'
import PlayerBlue from 'assets/map/PlayerBlue.webp'
import PlayerBlueLight from 'assets/map/PlayerBlueLight.webp'
import PlayerBlueDark from 'assets/map/PlayerBlueDark.webp'
import PlayerBrown from 'assets/map/PlayerBrown.webp'
import PlayerPink from 'assets/map/PlayerPink.webp'
import PlayerPinkLight from 'assets/map/PlayerPinkLight.webp'
import PlayerOrange from 'assets/map/PlayerOrange.webp'
import PlayerBiege from 'assets/map/PlayerBiege.webp'

import PlayerPurple2 from 'assets/map/PlayerPurple2.webp'

import PlayerYellow3 from 'assets/map/PlayerYellow3.webp'

import PlayerBlueLight2 from 'assets/map/PlayerBlueLight2.webp'

import { PlayerUrl } from 'src/utils/types'

const playerIcons: { [key in PlayerUrl]: string } = {
  lasqa: PlayerBlue,
  segall: PlayerGreen,
  praden: PlayerBrown,
  // predan: PlayerBrown,
  browjey: PlayerOrange,
  uselessmouth: PlayerPink,
  roadhouse: PlayerPurple2,
  melharucos: PlayerBlueLight2,
  maddyson: PlayerYellow3,
  vovapain: PlayerRed,
  timofey: PlayerGreenLight,
  unclebjorn: PlayerPinkLight,
  krabick: PlayerBlueDark,
  keliq_q: PlayerBiege,
}

export function getPlayerIcon(handle: PlayerUrl) {
  return playerIcons[handle] || PlayerBlueLight
}
