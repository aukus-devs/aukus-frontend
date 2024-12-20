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

type SpecialLink =
  | '$pointauc'
  | '$howlongtobeat'
  | '$sheikh-wheel'
  | '$difficulty-wheel'

type InnerContent = string | SpecialLink
type TextContent = string | InnerContent[]
type Content = { title: string; content: TextContent[] }
type Rule = { title: string; content: Content[] }

const playerRules: Rule[] = [
  {
    title: 'Правила аукциона и хода стримера',
    content: [
      {
        title: 'Аукцион',
        content: [
          [
            'Стример запускает аукцион на сайте',
            '$pointauc',
            'с таймером 20 минут и минимальной ставкой',
          ],
          'Фиксированный минимальный донат (100-500 ₽) выбирается стримером в начале аукуса и остается неизменным',
          'Один раз за аук можно изменить минимальный донат на любую сумму в пределе 100-500 ₽, по истечении аука стример обязан вернуть минималку на то значение, которое он выбрал в начале Аукуса',
          'Время на таймере нужно увеличивать за донат только если остаётся менее двух минут (по минуте за донат)',
          'Как только время таймера истекло все последующие донаты идут на следующий аук',
          [
            'После завершения аукциона и выбора игры (время вращения колеса — не менее 60 секунд), стример ролит сложность на сайте аукуса или ',
            '$difficulty-wheel',
            '. Сложности определяются относительно нормальной',
          ],
          'После ролла сложности начинается прохождение с максимально подходящим уровнем сложности',
          'Участники ивента не могут заказывать друг другу игры',
          'С 22 декабря максимальное время аукциона составляет 2 часа',
        ],
      },
      {
        title: 'Совершение хода',
        content: [
          'После прохождения игры участник бросает шестигранный кубик и перемещается по игровому полю',
          [
            'Время игры определяется по ',
            '$howlongtobeat',
            ' в основном режиме, колонке Average',
          ],
          'Продолжительность игры фиксируется на момент выпадения игры в колесе аукциона. Приоритетным является HLTB (main story - average) > лонгплеи на ютубе (среднее время из трёх) > обзоры в стиме (среднее из пяти)',
          'В случае, если игра является новинкой, или же это нонейм-игра, о которой нет таких данных — продолжительность игры определяется по итоговому времени её прохождения участником',
          'Если игра меньше 3 часов то бросается один шестигранный кубик без возможности подняться по лестнице',
          'Если игра длится от 3 до 15 часов то бросается 1 шестигранный кубик',
          'Если игра длится от 15 до 30 часов, стример может бросить два кубика на клетках от 1 до 80, но на клетках 81-101 — только один',
          'Если игра длится более 30 часов, стример может бросить три кубика на клетках от 1 до 80, но на клетках 81-101 — только один',
          'Для игр где можно проходить кампании на выбор, и на HTLB указано общее время для всех кампаний, часы рассчитываются по формуле (количество пройденных кампаний) x (общее время игры) / (общее количество компаний). Учитываются только основные полноценные кампании',
          'Особые игры - исключения:',
          'NieR: Automata - проходится со всеми концовками и считается на 30+ часов (3 кубика)',
        ],
      },
    ],
  },
  {
    title: 'Прохождение игр',
    content: [
      {
        title: 'Когда игра считается пройденной',
        content: [
          'Появились финальные титры (кроме шуточных концовок)',
          'Пройдены все уровни (например, в играх "три-в-ряд")',
          'Побит рекорд установленный разработчиком (High Score)',
          'Рогалик (rogue-like) считается пройденным после первой победы над финальным боссом',
        ],
      },
      {
        title: 'Особенности игр',
        content: [
          'В играх с несколькими кампаниями (например, RTS) стример может пройти только одну кампанию на выбор',
          'Если выпала визуальная новелла, весь текст должен быть зачитан (кроме повторений)',
          'В период 1-21 декабря нельзя скипать катсцены и диалоги, с 22 декабря можно. Диалоги в визуальных новеллах все равно нельзя скипать',
          'Разрешено использовать бонусы из GOTY-изданий, но донатить в игры для упрощения прохождения нельзя',
        ],
      },
    ],
  },
  {
    title: 'Дроп игры',
    content: [
      {
        title: 'Показ перед дропом',
        content: [
          'Активный игровой процесс должен быть показан на стриме хотя бы один час до её дропа',
        ],
      },
      {
        title: 'Наказания за дроп',
        content: [
          'Стример обязан выпить шоты крепкого алкоголя (не менее 35°), или отжаться или приседать количество раз по общей сумме аука',
          'Не обязательно делать все вместе, первый шот/сет должен быть сделан сразу а потом можно добить в течение следующего прохождения',
          'Для баланса у очень популярных участников [Maddyson] сумма для наказания увеличивается в 2 раза и указана в скобках [xxx]',
          'Можно комбинировать:',
          '0-10000 ₽ - 1 [0.5] шот / 30 [15] отжиманий / 50 [25] приседаний',
          '10.000-20.000 ₽ - 2 [1] шота / 60 [30] отжиманий / 100 [50] приседаний',
          '20.000-30.000 ₽ - 3 [1.5] шота / 90 [45] отжиманий / 150 [75] приседаний',
          '30.000-40.000 ₽ - 4 [2] шота / 120 [60] отжиманий / 200 [100] приседаний',
          '40.000-50.000 ₽ - 5 [2.5] шотов / 150 [75] отжиманий / 250 [125] приседаний',
          '50.000-70.000 ₽ - 6 [3] шотов / 180 [90] отжиманий / 300 [150] приседаний',
          '70.000-100.000 ₽ - 7 [3.5] шотов / 210 [105] отжиманий / 350 [175] приседаний',
          '100.000-140.000 ₽ - 8 [4] шотов / 240 [120] отжиманий / 400 [200] приседаний',
          '140.000-190.000 ₽ - 9 [4.5] шотов / 270 [135] отжиманий / 450 [225] приседаний',
          '190.000-240.000 ₽ - 10 [5] шотов / 300 [150] отжиманий / 500 [250] приседаний',
          '240.000-300.000 ₽ - 11 [5.5] шотов / 330 [175] отжиманий / 550 [275] приседаний',
          '300.000-370.000 ₽ - 12 [6] шотов / 360 [180] отжиманий / 600 [300] приседаний',
          '370.000-450.000 ₽ - 13 [6.5] шотов / 390 [195] отжиманий / 650 [325] приседаний',
          '450.000-540.000 ₽ - 14 [7] шотов / 420 [210] отжиманий / 700 [350] приседаний',
          '540.000-640.000 ₽ - 15 [7.5] шотов / 450 [225] отжиманий / 750 [375] приседаний',
          '640.000-750.000 ₽ - 16 [8] шотов / 480 [240] отжиманий / 800 [400] приседаний',
          '750.000-870.000 ₽ - 17 [8.5] шотов / 510 [255] отжиманий / 850 [425] приседаний',
          '870.000-1.000.000 ₽ - 18 [9] шотов / 540 [270] отжиманий / 900 [450] приседаний',
          'После выполнения наказания стример бросает кубик и движется по игровому полю в обратную сторону, на клетках 81-101 бросается два кубика',
        ],
      },
    ],
  },
  {
    title: 'Поведение во время стрима',
    content: [
      {
        title: 'Информация о текущей игре',
        content: [
          'Участник должен ставить игру-категорию стрима только когда он играет в эту игру, во время аука, просмотра видео и тд должна стоять категория Just Chatting (или аналогичная)',
          'Участник должен на стриме показывать количество шейх-моментов на текущей игре. Информация должна быть в текстовом виде в углу экрана, например: "Шейх-момент: 0 раз"',
        ],
      },
      {
        title: 'Запрещенные действия',
        content: [
          'Читы, трейнеры, сторонние программы для упрощения игры',
          'Использование модов, меняющих баланс игры',
          'Спидран-стратегии, если они были неизвестны до начала прохождения',
          'Запрещен абуз с файлами сохранений игры для получения преимуществ, игрой не предусмотренных',
          'Запрещено получение подсказок от собеседников в голосовых чатах, если они не основаны на личном игровом опыте',
        ],
      },
      {
        title: 'Подсказки из чата',
        content: [
          'Подсказки нежелательны, но разрешены для поинт-энд-клик квестов',
          'Запрещено скидывать внутриигровые коды и пароли',
          'Запрещено раскрывать абузы или спидран-стратегии',
        ],
      },
      {
        title: 'Кат-сцены и диалоги',
        content: [
          'С 1 по 21 декабря запрещено скипать кат-сцены и диалоги при первом прохождении в рамках аукциона',
          'С 22 декабря можно скипать кат-сцены и диалоги',
          'Если стример точно собирается дропнуть игру, он может скипать кат-сцены за последний час перед дропом',
        ],
      },
    ],
  },
  {
    title: 'Сложность и режимы игры',
    content: [
      {
        title: 'Сложность игры',
        content: [
          'Игра должна проходиться на сложности наиболее подходящей той, что выпала на колесе сложности',
          'Если в игре нет выбора сложности, стример может выбрать более лёгкий режим, но не "изи"',
          'Если игра автоматически понижает сложность - это не аннулирует прохождение',
        ],
      },
      {
        title: 'Опциональные режимы',
        content: [
          'Если в игре есть два режима (например, "хардкор" (1 жизнь и тд) и "обычный"), стример вправе выбирать более лёгкий',
        ],
      },
    ],
  },
  {
    title: 'Рероллы и непроходимые игры',
    content: [
      {
        title: 'Непроходимые игры',
        content: [
          'Если аукцион выиграла игра, которая не может быть завершена (например, MMO, песочница), производится реролл',
        ],
      },
      {
        title: 'Условия реролла',
        content: [
          'Игра уже была пройдена, дропнута или рерольнута текущим игроком в рамках этого или прошлых сезонов Аукуса',
          'Игра не имеет концовки (ММО, песочница, обязательный VR, многие игры в раннем доступе Steam)',
          'Игра не захватывается OBS или вылетает',
          'Игра запрещена к показу на платформе',
          'В игре отсутствует русский или английский интерфейс',
          'Игра пропагандирует темы запрещенные законом РФ, например S.T.A.L.K.E.R. 2',
          'Продолжительность игры меньше 1 часа (по HLTB)',
          'Продолжительность игры больше 150 часов (по HLTB)',
          'Реролл осуществляется путём повторного вращения колеса с удалением нерабочего варианта',
        ],
      },
    ],
  },
  {
    title: 'Особые правила ивента',
    content: [
      {
        title: 'Финальный рывок',
        content: [
          'Стример, попавший на клетку "Финальный рывок" (101), проводит аукцион и проходит игру, чтобы переместиться на финиш и стать победителем',
        ],
      },
      {
        title: 'Просмотровый аукцион',
        content: [
          'Стример, прошедший 5 игр подряд, может (по желанию) провести просмотровый аукцион по своим правилам. После просмотра фильма бросается 1d4 кубик',
          'Фильм/видео должно быть не меньше 1.5 часов, и не больше 2.5 часов',
          'На клетке "Финальный рывок" (101) проводить просмотровый аукцион запрещено',
        ],
      },
      {
        title: 'Шейх-момент',
        content: [
          'Перед донатом на шейх-момент донатер должен убедиться что шейх-момент возможен (на стриме демонстрируется проходимая в рамках ивента игра) и проверить текущую сумму через информацию на стриме',
          'Для баланса сумма для очень популярных стримеров [Maddyson] увеличена в 2 раза и указана в скобках [xxx]',
          'В донате должно быть явно указано что донат на шейх-момент, словами "шейх", "дроп" и тд',
          'За донат в 25.000 ₽ [50.000 ₽] донатер может с 50% вероятностью вынудить стримера дропнуть текущую игру (если успеть до финальных титров). Эти деньги идут только на дроп, а не на заказ новой игры. "Шейх-момент" можно активировать только во время игры',
          'Если выпал дроп, то стример должен сделать 1 шот / 30 отжиманий / 50 приседаний, дополнительно делать наказание за дроп НЕ НАДО. Так же активный игровой процесс должен быть показан на стриме хотя бы один час перед дропом',
          'Если выпал вариант не дропать, то стример должен так же сделать сделать 1 шот / 30 отжиманий / 50 приседаний и каждый последующий шейх-момент на текущей игре стоит на 25.000 ₽ [50.000 ₽] дороже, то есть 50.000 ₽ [100.000₽], потом 75.000 ₽ [150.000 ₽] и тд.',
          'Участникам ивента запрещено кидать шейх-моменты друг другу',
          ['Колесо для шейх моментов: ', '$sheikh-wheel'],
        ],
      },
    ],
  },
  {
    title: 'Наказания и награды',
    content: [
      {
        title: 'Награда',
        content: [
          'Победителю ивента Lasqa торжественно вручит Перстень Чемпиона Аукуса',
        ],
      },
      {
        title: 'Наказания за последние места',
        content: [
          'Последнее (13) место - снимается на "эротический календарь для женщин" и изготавливает его как минимум в 30 экземплярах для отправки другим участникам, а также топ-донутерам ивента',
          '12 место - должен заспидранить Майнкрафт за 60 минут. При неудаче — обязан выпить шот алкоголя (не менее 35°), и так до выполнения',
          '11 место - "идущий к реке". Пройти за раз со стримом 45000 шагов (ИРЛ стрим на улице). Отдыхать разрешается. В процессе делиться философскими рассуждениями на любые темы.',
          'Наказание за 10 место: Розыгрыш пня',
        ],
      },
      {
        title: 'Вклад в фонд на перстень',
        content: [
          '13 место (последнее) - 20000 ₽',
          '12 место - 18000 ₽',
          '11 место - 16000 ₽',
          '10 место - 14000 ₽',
          '9 место - 12000 ₽',
          '8 место - 10000 ₽',
          '7 место - 8000 ₽',
          '6 место - 6000 ₽',
          '5 место - 4000 ₽',
          '4 место - 2000 ₽',
        ],
      },
    ],
  },
  {
    title: 'Финальные условия и завершение ивента',
    content: [
      {
        title: 'Завершение ивента',
        content: [
          'Ивент продолжается до 20:00 МСК 25 декабря 2024 года',
          'Если кто-то дошёл до финиша до 25 декабря - ивент продолжается еще три дня для определения оставшихся мест по очкам',
        ],
      },
      {
        title: 'Определение победителя при отсутствии финишера',
        content: [
          'Если никто не дошёл до финиша, победитель определяется по очкам, по формуле: («Пройденные игры до 15ч» * 1 + «Пройденные игры до 30ч» * 1,5 + «Пройденные игры от 30ч» * 2 - дропнутые игры)*ряд',
        ],
      },
    ],
  },
]

export default function PlayerRules() {
  return (
    <Box>
      {playerRules.map((rule, index) => (
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
  if (text === '$pointauc') {
    return (
      <>
        {' '}
        <Link
          href={'https://pointauc.com/'}
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.blue}>pointauc.com</LinkSpan>
        </Link>{' '}
      </>
    )
  }

  if (text === '$difficulty-wheel') {
    return (
      <>
        {' '}
        <Link
          href={'https://wheelofnames.com/ru/stm-kge'}
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.blue}>wheelofnames.com/ru/stm-kge</LinkSpan>
        </Link>
      </>
    )
  }

  if (text === '$howlongtobeat') {
    return (
      <>
        <Link
          href={'https://howlongtobeat.com/'}
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.blue}>howlongtobeat.com</LinkSpan>
        </Link>
      </>
    )
  }

  if (text === '$sheikh-wheel') {
    return (
      <>
        <Link
          href={'https://wheelofnames.com/ru/th2-utw'}
          rel="noopener nereferrer"
          target="_blank"
        >
          <LinkSpan color={Color.blue}>wheelofnames.com/ru/th2-utw</LinkSpan>
        </Link>
      </>
    )
  }

  return text
}
