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
import PlayerPurple from 'assets/map/PlayerPurple.webp'
import PlayerYellow from 'assets/map/PlayerYellow.webp'
import PlayerBiege from 'assets/map/PlayerBiege.webp'

import PlayerPurple2 from 'assets/map/PlayerPurple2.webp'
import PlayerPurpleMoving2 from 'assets/map/PlayerPurpleMoving2.gif'

import PlayerYellow2 from 'assets/map/PlayerYellow2.webp'

import PlayerYellow3 from 'assets/map/PlayerYellow3.webp'
import PlayerYellowMoving3 from 'assets/map/PlayerYellowMoving3.gif'

import PlayerBlueLight2 from 'assets/map/PlayerBlueLight2.webp'

import PlayerPurpleMoving from 'assets/map/PlayerPurpleMoving.gif'
import PlayerOrangeMoving from 'assets/map/PlayerOrangeMoving.gif'
import PlayerPinkMoving from 'assets/map/PlayerPinkMoving.gif'
import PlayerPinkLightMoving from 'assets/map/PlayerPinkLightMoving.gif'
import PlayerRedMoving from 'assets/map/PlayerRedMoving.gif'
import PlayerBlueMoving from 'assets/map/PlayerBlueMoving.gif'
import PlayerBlueLightMoving from 'assets/map/PlayerBlueLightMoving.gif'
import PlayerBlueDarkMoving from 'assets/map/PlayerBlueDarkMoving.gif'
import PlayerGreenMoving from 'assets/map/PlayerGreenMoving.gif'
import PlayerGreenLightMoving from 'assets/map/PlayerGreenLightMoving.gif'
import PlayerBrownMoving from 'assets/map/PlayerBrownMoving.gif'
import PlayerBiegeMoving from 'assets/map/PlayerBiegeMoving.gif'
import PlayerYellowMoving from 'assets/map/PlayerYellowMoving.gif'
import { PlayerUrl } from 'src/utils/types'

const playerIcons: { [key in PlayerUrl]: string } = {
  lasqa: PlayerBlue,
  segall: PlayerGreen,
  praden: PlayerBrown,
  predan: PlayerBrown,
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
