import { Box, Button, Link, Tooltip } from '@mui/material'
import useScreenSize from 'src/context/useScreenSize'
import { Color } from 'utils/types'

const creators = [
  {
    name: 'lepayy',
    text: 'Дизайн интерфейсов',
  },
  {
    name: 'Wabar (Ваки)',
    text: 'Графический дизайн, карта',
  },
  {
    name: 'Рот в говне',
    text: 'Графический дизайн',
    tooltip: 'Он сам так назывался',
  },
  {
    name: 'Pepedg13ch',
    text: 'Анимации',
  },
  {
    name: 'CorruptedMushroom',
    text: 'Бекенд сервер',
  },
  {
    name: 'olegsvs',
    text: 'Сайт, домен, хостинг, бекенд',
  },
  // {
  //   name: 'gawk',
  //   text: 'Домен, хостинг',
  // },
  {
    name: 'kozjar',
    text: 'Интеграция с PointAuc.com',
  },
  {
    name: 'garik_1987',
    text: 'Мультистрим на VekSever.ru',
  },
  {
    name: 'madf12',
    text: 'Фронтенд, канвас картинок',
  },
  {
    name: 'Teitoku_POI',
    text: 'Организация дискорда',
  },
  {
    name: 'pechenka242',
    text: 'Аналитик-тестировщик',
  },
  {
    name: 'ShiroiKumo',
    text: 'Тестирование, обсуждение',
  },
  {
    name: 'Virtuoz',
    text: 'Обсуждение, идеи',
  },
  {
    name: 'mapcar',
    text: 'Фронтенд, организация',
  },
]

type Payment = {
  name: string
  text: string
  amount: number
}

const sponsors: Payment[] = [
  {
    name: 'CruxTerminatus',
    amount: 500,
    text: 'а я еще дам деняк на пиво (или не на пиво)',
  },
  {
    name: 'Tsessarsky',
    text: 'Спасибо за ивент!',
    amount: 5000,
  },
  {
    name: 'Arrivelen',
    text: 'Я Пепега! Спасибо всем ребятам за все что вы делаете <3',
    amount: 5000,
  },
  {
    name: 'Balabama',
    text: 'Кто прочитал это сообщение, обязан закинуть 100 рублей разрабам на бусти',
    amount: 5000,
  },
  {
    name: 'Юзя',
    text: 'Спасибо вам всем огромное от всей души за сайт и интеграцию с поинтауком! ❤️',
    amount: 5000,
  },
  {
    name: 'bibus_dikkus',
    amount: 1000,
    text: '',
  },
  {
    name: 'Sadistic_killer',
    amount: 1000,
    text: '',
  },
  {
    name: '4echevica',
    text: '',
    amount: 1000,
  },
  {
    name: 'Sppoo',
    text: '',
    amount: 1000,
  },
  {
    name: 'Virtuoz',
    text: 'делайте красиво',
    amount: 1000,
  },
  {
    name: 'alevser',
    text: 'летс гооо',
    amount: 777,
  },
  {
    name: 'empartys',
    amount: 500,
    text: '',
  },
  {
    name: 'Vagner',
    text: '❤️',
    amount: 500,
  },
  {
    name: 'CruxTerminatus',
    text: 'Спонсируем хорошее настроение',
    amount: 500,
  },
  { name: 'elmanana', amount: 300, text: '' },
  {
    name: 'Tr4visTouchd0wn',
    amount: 300,
    text: '',
  },
  { name: 'Quizy', text: '', amount: 300 },
]

export default function AboutContent() {
  const { headerSize } = useScreenSize()

  const groupDuplicateSponsors = (sponsors: Payment[]) => {
    const result: Payment[] = []
    sponsors.forEach((sponsor) => {
      const existing = result.find((item) => item.name === sponsor.name)
      if (existing) {
        existing.amount += sponsor.amount
      } else {
        result.push({ ...sponsor })
      }
    })
    return result
  }

  const grouped = groupDuplicateSponsors(sponsors)
  const sponsorsSortedByAmount = grouped.sort((a, b) => b.amount - a.amount)

  return (
    <Box display="flex" justifyContent="center">
      <Box
        textAlign={'left'}
        width={'740px'}
        marginLeft={'10px'}
        marginRight={'10px'}
      >
        <Box fontSize={headerSize} fontWeight={700} lineHeight={'1.2'}>
          Сайт сделан специально для третьего сезона АУКУСа
        </Box>

        <Box marginTop={'30px'} fontSize={'20px'} fontWeight={500}>
          Вы можете поддержать сайт и разработчиков
        </Box>
        <Box marginTop={'50px'}>
          <Link
            href="https://boosty.to/aukus"
            rel="noopener nereferrer"
            target="_blank"
          >
            <Button style={{ fontSize: '16px', fontWeight: 500 }}>
              Поддержать на бусти
            </Button>
          </Link>
        </Box>

        <Box marginTop={'100px'} fontSize={'32px'}>
          Наши спонсоры
        </Box>
        <Box marginTop={'10px'} fontSize={'20px'}>
          {sponsorsSortedByAmount.map((item, index) => {
            const hasText = item.text.length > 0
            const text = hasText && item.amount >= 5000 ? ` — ${item.text}` : ''
            return (
              <Box marginTop={'20px'} key={index} color={'white'}>
                {item.name}
                <span style={{ color: Color.greyNew }}>{text}</span>
              </Box>
            )
          })}
        </Box>
        <Box marginTop={'100px'} fontSize={'32px'}>
          Команда разработки сайта
        </Box>
        <Box marginTop={'10px'} fontSize={'20px'}>
          {creators.map((item, index) => {
            return (
              <Box key={index} marginTop={'20px'}>
                <Tooltip title={item.tooltip} key={index}>
                  <span style={{ color: 'white' }}>{item.name}</span>
                </Tooltip>{' '}
                <span style={{ color: Color.greyNew }}>— {item.text}</span>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
