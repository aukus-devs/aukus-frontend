import sample from 'lodash/sample'
import random from 'lodash/random'
import { Player, PlayerMove } from './types'

const playerLasqa: Player = {
  id: 1,
  name: 'Lasqa',
  twitch_stream_link: '',
  vk_stream_link: '',
  donation_link: 'https://www.donationalerts.com/r/lasqa',
  kick_stream_link: 'https://live.kickplay.ru/lasqa',
  map_position: 0,
  current_game: 'Балдурс Гейт 3',
  current_game_duration: 18034,
  is_online: false,
  url_handle: 'lasqa',
  stream_last_category: 'Gothic',
  first_name: 'Богдан',
  last_name: '',
  telegram_link: 'https://t.me/lasqa',
  current_game_updated_at: '2024-10-11 12:14:15',
  current_game_image:
    'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
}

const playerSegall: Player = {
  id: 2,
  name: 'Segall',
  twitch_stream_link: 'https://www.twitch.tv/segall',
  vk_stream_link: 'https://live.vkplay.ru/segall',
  donation_link: 'https://www.donationalerts.com/r/segall',
  kick_stream_link: '',
  current_game: '',
  map_position: 8,
  is_online: false,
  url_handle: 'segall',
  stream_last_category: 'Just Chatting',
  first_name: 'Александр',
  last_name: '',
  telegram_link: 'https://t.me/segall',
  current_game_updated_at: '2024-10-11 12:14:15',
  current_game_image:
    'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
  auction_timer_started_at: 'Sat, 07 Dec 2024 19:25:04 GMT',
}

const playerRoadhouse: Player = {
  id: 3,
  name: 'Roadhousexxxxxx',
  twitch_stream_link: 'https://www.twitch.tv/roadhouse',
  vk_stream_link: 'https://live.vkplay.ru/roadhouse',
  donation_link: 'https://www.donationalerts.com/r/roadhouse',
  kick_stream_link: '',
  map_position: 6,
  current_game: 'Готика',
  is_online: true,
  url_handle: 'roadhouse',
  stream_last_category: 'Witcher',
  first_name: 'Андрей',
  last_name: '',
  telegram_link: 'https://t.me/roadhouse',
  current_game_updated_at: '2024-10-11 12:14:15',
  current_game_image:
    'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
}

const playerPraden: Player = {
  id: 4,
  name: 'Maddyson',
  twitch_stream_link: 'https://www.twitch.tv/roadhouse',
  vk_stream_link: 'https://live.vkplay.ru/roadhouse',
  donation_link: 'https://www.donationalerts.com/r/roadhouse',
  kick_stream_link: '',
  map_position: 6,
  current_game: 'Готика',
  is_online: true,
  url_handle: 'praden',
  stream_last_category: 'Witcher',
  first_name: 'Денис',
  last_name: '',
  telegram_link: 'https://t.me/roadhouse',
  current_game_updated_at: '2024-10-11 12:14:15',
  current_game_image:
    'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
}

export const playersMock = [
  playerLasqa,
  playerSegall,
  // playerRoadhouse,
  // playerPraden,
].sort((a, b) => {
  if (a.name > b.name) {
    return 1
  } else {
    return -1
  }
})

export const playersMockById = playersMock.reduce(
  (acc, player) => {
    acc[player.id] = player
    return acc
  },
  {} as Record<number, Player>
)

const itemReviews: Array<string> = [
  'ПРОЙДЕНО: ИГРУШКА-ПРИКОЛЮХА, ЖАЛЬ ПРИШЛОСЬ РАШИТЬ ',
  'Фильм «Вася не в себе» (2023). Добрая комедия про важность таджиков с Павлом Прилучным. 5/10 ))) ',
  'ПРОЙДЕНО: игру бы оценил нормально, если бы не мегауебищная камера, которая руинит весь экспириенс от прохождения 4/10',
  'Супер-дупер игра, музыка кайф, геймплей тоже. Да и сюжет если вчухаться приятный. 10/10 (пройдено за 5 часов)',
  'Клевая игра. Думал, что будет говно блевотное, но разнообразие геймплея и чувственный сюжет не позволяют поставить этой штуке меньше 8 баллов. 8/10',
  'Клевая игрушенция, думал что будет душно, а оказалось прикольно. Надо пройти все предыдущие части 7.5/10',
  'Неплохая задумка, хорошие зарисовки, российские разрабы. 7/10',
  '10 часов однообразных гонок. В игре минимальный набор гоночной игры, сюжета кот наплакал, миссии начинаются с нихуя (простите меня за мой французский), просто в рандомном месте на карте активируются. При этом до них можно даже не ездить а просто выбирать через мапу. 3/10',
  'Необычная головоломка с закадками внутри компьютера макинтош, удивила пару раз интересныйми задачами. 6/10',
  'Шедевральная игра, коих мало. 10/10 ',
]

export function playerMovesMock() {
  const dates = generateDateRange(
    new Date('2024-12-04'),
    new Date('2024-12-10')
  )
  const data: PlayerMove[] = []
  let currentPosition = 0
  const itemsAmount = 5

  data.push({
    player_move_id: 1,
    player_id: 1,
    created_at: '2024-12-04',
    id: 1,
    item_title: 'Готика',
    type: 'completed',
    dice_roll: 3,
    cell_to: 3,
    cell_from: 0,
    item_review: 'ПРОЙДЕНО: ИГРУШКА-ПРИКОЛЮХА, ЖАЛЬ ПРИШЛОСЬ РАШИТЬ ',
    item_rating: 5,
    stair_from: null,
    stair_to: null,
    snake_from: null,
    snake_to: null,
    item_length: 'medium',
    stream_title_category_duration: '11285',
    item_image:
      'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
    vod_link:
      'test link 1\nДень 1 https://twitch.com/lasqa\nЧасть 2 https://youtube.com/test\ntest link 2\ntest field',
  })

  data.push({
    player_move_id: 2,
    player_id: 2,
    created_at: '2024-12-04',
    id: 2,
    item_title: 'Соник',
    type: 'completed',
    dice_roll: 3,
    cell_to: 11,
    cell_from: 8,
    item_review:
      'Фильм «Вася не в себе» (2023). Добрая комедия про важность таджиков с Павлом Прилучным. 5/10 ))) ',
    item_rating: 5,
    stair_from: null,
    stair_to: null,
    snake_from: null,
    snake_to: null,
    item_length: 'medium',
    stream_title_category_duration: '11285',
    item_image:
      'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
    vod_link:
      'test link 1\nДень 1 https://twitch.com/lasqa\nЧасть 2 https://youtube.com/test\ntest link 2\ntest field',
  })

  data.push({
    player_move_id: 3,
    player_id: 1,
    created_at: '2024-12-04',
    id: 3,
    item_title: 'Ведьмак',
    type: 'completed',
    dice_roll: 8,
    cell_to: 11,
    cell_from: 3,
    item_review: 'ПРОЙДЕНО: ИГРУШКА-ПРИКОЛЮХА, ЖАЛЬ ПРИШЛОСЬ РАШИТЬ ',
    item_rating: 5,
    stair_from: null,
    stair_to: null,
    snake_from: null,
    snake_to: null,
    item_length: 'medium',
    stream_title_category_duration: '11285',
    item_image:
      'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
    vod_link:
      'test link 1\nДень 1 https://twitch.com/lasqa\nЧасть 2 https://youtube.com/test\ntest link 2\ntest field',
  })

  data.push({
    player_move_id: 4,
    player_id: 2,
    created_at: '2024-12-04',
    id: 4,
    item_title: 'Соник',
    type: 'completed',
    dice_roll: 10,
    cell_to: 3,
    cell_from: 11,
    item_review:
      'Фильм «Вася не в себе» (2023). Добрая комедия про важность таджиков с Павлом Прилучным. 5/10 ))) ',
    item_rating: 5,
    stair_from: null,
    stair_to: null,
    snake_from: null,
    snake_to: null,
    item_length: 'medium',
    stream_title_category_duration: '11285',
    item_image:
      'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
    vod_link:
      'test link 1\nДень 1 https://twitch.com/lasqa\nЧасть 2 https://youtube.com/test\ntest link 2\ntest field',
  })

  return data

  for (let i = 0; i < itemsAmount; i++) {
    const status: PlayerMove['type'] = sample([
      'drop',
      'completed',
      'sheikh',
      'reroll',
      'movie',
    ])

    let diceRoll = 0
    if (status === 'drop' || status === 'sheikh') {
      diceRoll = -sample([1, 2, 3, 4, 5, 6])
      currentPosition += diceRoll
      if (currentPosition < 0) {
        currentPosition = 0
      }
    } else if (status === 'movie') {
      diceRoll = sample([1, 2, 3, 4])
      currentPosition += diceRoll
    } else if (status !== 'reroll') {
      diceRoll = sample([1, 2, 3, 4, 5, 6])
      currentPosition += diceRoll
    }

    data.push({
      player_move_id: i + 1,
      player_id: sample([1, 2, 3, 4]),
      created_at: dates[i].toDateString(),
      id: i + 1,
      item_title: sample(['Готика', 'Соник', 'Ведьмак', 'Смута']),
      type: status,
      dice_roll: diceRoll,
      cell_to: currentPosition,
      cell_from: currentPosition - diceRoll,
      item_review: sample(itemReviews) as string,
      item_rating: sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      stair_from: null,
      stair_to: null,
      snake_from: null,
      snake_to: null,
      item_length: 'medium',
      stream_title_category_duration: sample(['11285', 0]) as string,
      item_image:
        'https://static-cdn.jtvnw.net/ttv-boxart/Valheim-{width}x{height}.jpg',
      vod_link:
        'test link 1\nДень 1 https://twitch.com/lasqa\nЧасть 2 https://youtube.com/test\ntest link 2\ntest field',
    })
  }
  return data
}

function generateDateRange(startDate: Date, endDate: Date) {
  // Create an array to store the dates
  const dateArray = []

  // Create a new Date object for the start date to avoid modifying the original startDate
  const currentDate = new Date(startDate)

  // Loop until the current date is greater than the end date
  while (currentDate <= endDate) {
    // Add the current date to the array
    dateArray.push(new Date(currentDate))

    // Increment the current date by one day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Return the array of dates
  return dateArray
}

export function playerStatsMock() {
  return playersMock.map((player) => ({
    id: player.id,
    map_position: random(1, 101),
    total_moves: random(1, 100),
    games_completed: random(1, 30),
    games_dropped: random(1, 20),
    sheikh_moments: random(1, 20),
    rerolls: random(1, 20),
    movies: random(1, 10),
    ladders: random(1, 20),
    snakes: random(1, 20),
    tiny_games: random(1, 20),
    short_games: random(1, 20),
    medium_games: random(1, 20),
    long_games: random(1, 20),
  }))
}
