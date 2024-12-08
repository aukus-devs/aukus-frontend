import { Box, Button, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import useScreenSize from 'src/context/useScreenSize'
import { fetchSponsors } from 'src/utils/api'
import { Color } from 'utils/types'
import FlashIcon from 'assets/icons/flash.svg?react'
import LinkSpan from 'src/components/LinkSpan'
import { Link } from 'react-router-dom'

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

export default function AboutContent() {
  const { headerSize } = useScreenSize()

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsors'],
    queryFn: fetchSponsors,
    staleTime: 1000 * 60 * 5,
  })

  const sponsors = sponsorsData?.dons || []

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
            to="https://boosty.to/aukus"
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
          {sponsors.map((item, index) => {
            const text = item.text || ''
            const displayText =
              text.length > 0 && item.type === 'big' ? `— ${item.text}` : ''

            if (item.name.toLowerCase() === 'юзя') {
              return (
                <Box
                  marginTop={'20px'}
                  key={index}
                  color={'white'}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <FlashIcon />
                  <Link to="/players/uselessmouth">
                    <LinkSpan color={Color.blue}>{item.name}</LinkSpan>
                  </Link>
                  <span style={{ color: Color.greyNew }}>
                    &nbsp;
                    {displayText}
                  </span>
                </Box>
              )
            }

            return (
              <Box marginTop={'20px'} key={index} color={'white'}>
                {item.name}
                <span style={{ color: Color.greyNew }}>
                  &nbsp;{displayText}
                </span>
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
