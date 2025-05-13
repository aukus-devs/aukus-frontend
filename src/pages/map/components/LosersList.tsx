import { Box } from '@mui/material'
import LinkSpan from 'src/components/LinkSpan'
import { Color, getPlayerColor, Player, PlayerUrl } from 'src/utils/types'

type LosersListProps = {
  players: Player[]
}

type LoserItem = {
  url_handle: PlayerUrl
  place: number
  text: string
  status: 'in-process' | 'done'
  link?: string
}

export default function LosersList({ players }: LosersListProps) {
  const losers: LoserItem[] = [
    {
      url_handle: 'lasqa',
      place: 10,
      text: 'Розыграть пень',
      status: 'in-process',
    },
    {
      url_handle: 'unclebjorn',
      place: 11,
      text: 'Пройти за раз со стримом 45000 шагов (ИРЛ стрим на улице). Отдыхать разрешается. В процессе делиться философскими рассуждениями на любые темы',
      status: 'done',
      link: 'https://www.twitch.tv/videos/2457349306',
    },
    {
      url_handle: 'segall',
      place: 12,
      text: 'Заспидранить Майнкрафт за 60 минут. При неудаче — обязан выпить шот алкоголя (не менее 35°)',
      status: 'in-process',
    },
    {
      url_handle: 'vovapain',
      place: 13,
      text: 'Снимается на "эротический календарь для женщин"',
      status: 'in-process',
    },
  ]
  return (
    <Box>
      {losers.map((loser, index) => {
        const player = players.find(
          (player) => player.url_handle === loser.url_handle
        )
        if (!player) {
          return null
        }
        return (
          <Box key={index} marginTop="10px">
            <LoserItem player={player} loser={loser} />
          </Box>
        )
      })}
    </Box>
  )
}

type LoserProps = {
  player: Player
  loser: LoserItem
}

function LoserItem({ player, loser }: LoserProps) {
  return (
    <Box
      style={{
        backgroundColor: getPlayerColor(player.url_handle),
        padding: '15px',
        borderRadius: '15px',
      }}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        gap="10px"
        marginBottom="10px"
        style={{ fontSize: '12px', fontWeight: 700 }}
      >
        <Box
          style={{
            backgroundColor: Color.white,
            borderRadius: '5px',
            color: 'black',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          {loser.status === 'done' ? 'Выполнено' : 'В процессе'}
        </Box>
        <Box
          style={{
            backgroundColor: Color.white,
            borderRadius: '5px',
            color: 'black',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          {player.name}
        </Box>
        <Box
          style={{
            backgroundColor: Color.white,
            borderRadius: '5px',
            color: 'black',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          Наказание за {loser.place} место
        </Box>
      </Box>
      <span style={{ fontSize: '20px', fontWeight: 700 }}>{loser.text}</span>
      {loser.link && (
        <Box>
          <LinkSpan>
            <a href={loser.link} target="_blank" rel="noopener noreferrer">
              <span style={{ fontSize: '12px' }}>Ссылка на выполнение</span>
            </a>
          </LinkSpan>
        </Box>
      )}
    </Box>
  )
}
