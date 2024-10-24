import { Box, Button, Slider, SliderThumb } from '@mui/material'
import { Mark } from '@mui/material/Slider/useSlider.types'
import { range } from 'lodash'
import { useTimelapse } from 'pages/map/hooks/useTimelapse'
import { useEffect, useState } from 'react'
import { Color, Player, PlayerMove } from 'utils/types'

const StartDate = new Date('2024-10-01')
StartDate.setHours(0, 0, 0, 0)

const Today = new Date()
Today.setHours(0, 0, 0, 0)

const daysBetween = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.abs(diffTime / (1000 * 60 * 60 * 24))
}

const AmountOfDays = daysBetween(StartDate, Today)
const StartDateDay = StartDate.getDate()

const DateMarks = range(0, AmountOfDays + 1, 1).map((value) => ({
  value,
  label: (value + StartDateDay).toString(),
}))

export default function TimelapseButton() {
  const timelapseState = useTimelapse()

  const [dateDiff, setDateDiff] = useState<number>(
    daysBetween(StartDate, Today)
  )

  const currentDate = new Date(StartDate)
  currentDate.setDate(StartDate.getDate() + dateDiff)

  const dateString = currentDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })

  const datePart = extractDate(currentDate)

  useEffect(() => {
    timelapseState.setSelectedDate(datePart)
    timelapseState.setSelectedMoveId(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePart])

  const handleDateDiffChange = (value: number) => {
    setDateDiff(value)
  }

  if (timelapseState.state === 'closed') {
    return (
      <Button
        onClick={() => timelapseState.setState('date_selection')}
        sx={{ width: '320px' }}
      >
        Timelapse
      </Button>
    )
  }

  if (timelapseState.state === 'date_selection') {
    return (
      <Box width={'100%'}>
        <Box
          style={{
            display: 'flex',
            alignContent: 'flex-end',
            flexWrap: 'wrap',
            backgroundColor: 'black',
            width: '100%',
            height: '63px',
            paddingLeft: '20px',
            paddingRight: '20px',
            borderRadius: '10px',
            marginBottom: '10px',
          }}
        >
          <Slider
            min={0}
            max={AmountOfDays}
            step={1}
            marks={DateMarks}
            slots={{
              markLabel: CustomMark,
              rail: CustomRail,
              thumb: CustomThumb,
            }}
            getAriaValueText={displayText}
            valueLabelDisplay="off"
            track={false}
            sx={{ margin: 0 }}
            value={dateDiff}
            onChange={(_, value) =>
              handleDateDiffChange(Math.floor(value as number))
            }
          />
        </Box>
        <Box textAlign="center" display="relative">
          <Button
            onClick={() => timelapseState.setState('move_selection')}
            sx={{ width: '320px', marginRight: '10px', position: 'relative' }}
          >
            Выбрать дату - {dateString}
          </Button>
          <Button
            onClick={() => timelapseState.setState('closed')}
            sx={{
              backgroundColor: 'black',
              position: 'absolute',
              width: '163px',
            }}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    )
  }

  const movesAmount = timelapseState.moves.length || 1

  const turnMarks = range(1, movesAmount + 1, 1).map((value) => ({
    value,
    label: value.toString(),
  }))

  const nextDay = new Date(currentDate)
  nextDay.setDate(currentDate.getDate() + 1)
  const nextDayString = nextDay.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })

  const prevDay = new Date(currentDate)
  prevDay.setDate(currentDate.getDate() - 1)
  const prevDayString = prevDay.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })

  let turnText = ''

  const currentMove = timelapseState.moves[timelapseState.selectedMoveId - 1]
  if (currentMove) {
    const movePlayer = timelapseState.players.find(
      (player) => player.id === currentMove.player_id
    )

    if (movePlayer) {
      turnText = turnDescription(movePlayer, currentMove)
    }
  }

  return (
    <Box width={'100%'}>
      <Box width={'100%'} display="flex" justifyContent={'center'}>
        <Box
          style={{
            backgroundColor: Color.blue,
            color: 'white',
            height: '38px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '590px',
          }}
        >
          {turnText}
        </Box>
      </Box>
      <Box
        style={{
          display: 'flex',
          alignContent: 'flex-end',
          flexWrap: 'wrap',
          backgroundColor: 'black',
          width: '100%',
          height: '63px',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '10px',
          marginBottom: '10px',
        }}
      >
        <Slider
          min={1}
          max={movesAmount}
          step={1}
          marks={turnMarks}
          slots={{
            markLabel: CustomMark,
            rail: CustomRail,
            thumb: CustomThumb,
          }}
          getAriaValueText={displayText}
          valueLabelDisplay="off"
          track={false}
          sx={{ margin: 0 }}
          value={timelapseState.selectedMoveId}
          onChange={(_, value) => {
            timelapseState.setSelectedMoveId(Math.floor(value as number))
          }}
        />
      </Box>
      <Box display={'flex'} justifyContent="center">
        {!datesEqual(currentDate, StartDate) ? (
          <Button
            onClick={() => handleDateDiffChange(dateDiff - 1)}
            sx={{
              width: '204px',
              backgroundColor: 'black',
              left: '0',
            }}
          >
            {'<-'} {prevDayString}
          </Button>
        ) : (
          <Box sx={{ width: '204px' }} />
        )}
        <Button
          fullWidth
          onClick={() => timelapseState.setState('date_selection')}
          sx={{
            width: '163px',
            marginRight: '10px',
            marginLeft: '10px',
          }}
        >
          Вернуться
        </Button>
        {!datesEqual(currentDate, Today) ? (
          <Button
            onClick={() => handleDateDiffChange(dateDiff + 1)}
            sx={{
              width: '204px',
              backgroundColor: 'black',
            }}
          >
            {nextDayString} {'->'}
          </Button>
        ) : (
          <Box sx={{ width: '204px' }} />
        )}
      </Box>
    </Box>
  )
}

function displayText(value: number) {
  return `${value}`
}

type MarkProps = {
  'data-index': number
  ownerState: {
    marks: Mark[]
  }
  label: string
  style: React.CSSProperties
}

function CustomMark(props: MarkProps) {
  const index = props['data-index'] as number
  const mark = props.ownerState.marks[index] as Mark

  const baseStyles: React.CSSProperties = {
    backgroundColor: 'black',
    height: '24px',
    // width: '50px',
    color: 'white',
    top: '0px',
    position: 'absolute',
    // left: `${index * 2}%`,
  }

  const offsetLeft = index > 9 ? '-6px' : '-3px'

  return (
    <div
      style={{
        ...props.style,
        ...baseStyles,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '-26px',
          left: offsetLeft,
          userSelect: 'none',
        }}
      >
        {mark.label}
      </span>
      <div
        style={{
          height: '18px',
          width: '4px',
          backgroundColor: Color.blue,
          borderRadius: '5px',
        }}
      />
    </div>
  )
}

type RailProps = {
  style: React.CSSProperties
}

function CustomRail(props: RailProps) {
  return (
    <div
      style={{
        ...props.style,
        position: 'absolute',
        height: '4px',
        top: '10px',
        width: '1263px',
        backgroundColor: Color.blue,
        borderRadius: '5px',
      }}
    />
  )
}

type ThumbProps = {
  className: string
  style: React.CSSProperties
}

function CustomThumb(props: ThumbProps) {
  // return <SliderThumb {...props} />
  // console.log(props)
  const className = props.className as string
  const isActive = className.includes('Mui-active')

  return (
    <SliderThumb
      {...props}
      style={{
        ...props.style,
        height: isActive ? '24px' : '18px',
        width: isActive ? '16px' : '12px',
        border: '1px solid white',
        backgroundColor: Color.white,
        borderRadius: isActive ? '10px' : '6px',
        transform: isActive ? 'translate(-36%, -77%)' : 'translate(-34%, -84%)',
      }}
    />
  )
}

function datesEqual(date1: Date, date2: Date) {
  const date1String = date1.toISOString().slice(0, 10)
  const date2String = date2.toISOString().slice(0, 10)
  return date1String === date2String
}

function turnDescription(player: Player, move: PlayerMove) {
  const actions = {
    completed: 'прошел',
    drop: 'дропнул',
    movie: 'посмотрел',
    reroll: 'рерольную',
    sheikh: 'словил шейха на',
  }

  const action = actions[move.type] || move.type

  return `${player.name} ${action} ${move.item_title}, ходит с ${move.cell_from} на ${move.cell_to}`
}

function extractDate(date: Date) {
  // Extract year, month, and day and format them properly
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
