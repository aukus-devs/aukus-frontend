import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  Typography,
} from '@mui/material'
import LinkSpan from 'components/LinkSpan'
import { Color } from 'utils/types'

type TextContent = string | string[]
type Content = { title: string; content: TextContent[] }
type Rule = { title: string; content: Content[] }

const donaterRules: Rule[] = [
  {
    title: 'Ограничения на типы игр',
    content: [
      {
        title: 'Игры которых не было ранее',
        content: [
          'Можно заказывать только те игры, которые стример ещё не проходил и не дропал ни в текущем, ни в прошлых сезонах ивента. На странице стримера есть информация о всех играх, которые они уже играли, и их можно найти через строку поиска или через CTRL+F',
        ],
      },
      {
        title: 'Проходимость игры',
        content: [
          'Заказывайте только проходимые игры, у которых есть титры или итоговая таблица с результатами. Игры вроде Доты или CS, а также браузерные игры, игры с DVD-дисков или те, что требуют эмуляторов, заказывать нельзя',
        ],
      },
      {
        title: 'Продолжительность игры',
        content: [
          [
            'Минимальная длительность прохождения заказанной игры должна быть не менее 60 минут. Для проверки времени прохождения можно воспользоваться сайтом',
            'howlongtobeat.com',
          ],
          'Максимальная длительность прохождения игры 150 часов (по HLTB)',
        ],
      },
      {
        title: 'Дополнения (DLC)',
        content: [
          'Можно заказывать только такие дополнения, которые запускаются отдельно от основной игры. DLC, доступные только из меню игры или после её прохождения, не принимаются',
        ],
      },
      {
        title: 'Максимальная стоимость игры',
        content: ['Заказывать игры стоимостью дороже 15 000 ₽ запрещено'],
      },
      {
        title: 'Ограничения на содержание',
        content: [
          'Нельзя заказывать игры которые пропагандируют темы запрещенные законом РФ, например S.T.A.L.K.E.R. 2',
        ],
      },
    ],
  },
  {
    title: 'Особые моменты и ограничения',
    content: [
      {
        title: 'Ограничения на условия прохождения',
        content: [
          'Донатер может заказать только саму игру, без требований по прохождению (например, нельзя заставлять стримера играть за определённую расу или класс)',
        ],
      },
      {
        title: 'Запрет на неопределённые заказы',
        content: [
          'Нельзя донатить на игры "на усмотрение стримера" — только конкретные варианты, подходящие для аукциона',
        ],
      },
      {
        title: 'Время приёма заказов',
        content: [
          'Заказывать игры можно всегда во время стрима, кроме момента, когда стример находится на клетке "Финальный рывок" (101)',
        ],
      },
      {
        title: 'Шейх-момент',
        content: [
          'За донат в 25 000 ₽ донатер может с 50% вероятностью вынудить стримера дропнуть текущую игру (если успеть до финальных титров). Стример должен выпить шот или сделать физическое упражнение (отжимания или приседания), независимо от результата дропа. Эти деньги идут только на дроп, а не на заказ новой игры. "Шейх-момент" можно активировать только во время игры',
          'Если выпал вариант не дропать, каждый последующий шейх-момент на текущей игре стоит на 25 000 ₽ дороже, то есть 50 000 ₽, потом 75 000 ₽ и тд.',
          ['Колесо для шейх моментов:', 'wheelofnames.com'],
        ],
      },
      {
        title: 'Корректировка заказа',
        content: [
          'Если донатер случайно заказал неподходящую игру (например, она слишком короткая или уже была у стримера), он может заменить её на другую, если донат был не анонимным и его вариант был единственным предложенным',
        ],
      },
    ],
  },
]

export default function DonaterRules() {
  return (
    <Box>
      {donaterRules.map((rule, index) => (
        <Box marginTop={'25px'} key={index}>
          <Box>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                borderRadius: '15px',
                background: Color.greyDark,
                boxShadow: 'none',
              }}
              square={true}
            >
              <AccordionSummary
                sx={{
                  background: Color.greyDark,
                  borderRadius: '15px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                <Typography fontSize={'24px'} fontWeight={600} lineHeight={1.2}>
                  {rule.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  background: Color.greyDark,
                  borderRadius: '15px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop: 0,
                }}
              >
                {rule.content.map((content, index) => (
                  <Box marginLeft={2} marginBottom={2} key={index}>
                    <Typography fontWeight={400} fontSize={'16px'}>
                      {content.title}
                      {':'}
                    </Typography>
                    <Box marginTop={1} />
                    <ul style={{ fontWeight: 400, fontSize: '16px' }}>
                      {content.content.map((text, index) => {
                        if (Array.isArray(text)) {
                          return (
                            <li key={index}>
                              {text.map((textItem, index) => (
                                <ContentItem text={textItem} key={index} />
                              ))}
                            </li>
                          )
                        }
                        return <li key={index}>{text}</li>
                      })}
                    </ul>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function ContentItem({ text }: { text: string }) {
  if (text.startsWith('howlongtobeat.com')) {
    return (
      <>
        {' '}
        <Link
          href="https://howlongtobeat.com/"
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.purple}>https://howlongtobeat.com/</LinkSpan>
        </Link>
      </>
    )
  }

  if (text.startsWith('wheelofnames.com')) {
    return (
      <>
        {' '}
        <Link
          href={'https://wheelofnames.com/ru/2r3-q2j'}
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.blue}>{text}</LinkSpan>
        </Link>
      </>
    )
  }

  return text
}
