import { Circle } from '@mui/icons-material'
import RatingBox from 'assets/icons/rating_box.svg?react'
import { IconContainerProps, Rating } from '@mui/material'
import { useState } from 'react'
import { Color } from 'utils/types'

function IconContainer(props: IconContainerProps) {
  const { value, color, ...other } = props
  const round = Math.round(value)

  const isExact = value % 1 === 0

  const active = other.className?.includes('MuiRating-iconFilled')
  const style = {
    ...(active && color ? { color } : {}),
  }

  if (!isExact && active) {
    return (
      <span
        {...other}
        // className={'half-rating'}
        style={{ width: '40px', height: '24px', display: 'flex' }}
      >
        <RatingBox style={style} />
      </span>
    )
  }

  return (
    <span {...other} style={{ alignSelf: 'center' }}>
      <RatingBox style={style} />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '13px',
          color: 'white',
          alignSelf: 'center',
          zIndex: 90,
        }}
      >
        {round}
      </span>
    </span>
  )
}

function getIconContainerWithColor(value?: number | null) {
  if (!value) {
    return IconContainer
  }

  const color =
    value < 4
      ? Color.red
      : value < 7
        ? Color.orange
        : value > 9
          ? Color.purple
          : Color.green

  return (props: IconContainerProps) => (
    <IconContainer {...props} color={color} />
  )
}

export default function NumRating(props: React.ComponentProps<typeof Rating>) {
  const [activeValue, setActiveValue] = useState<number | null>(null)

  const handleChangeActive = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveValue(newValue)
    props.onChangeActive?.(event, newValue)
  }

  const colorValue = activeValue && activeValue > 0 ? activeValue : props.value

  return (
    <Rating
      {...props}
      onChangeActive={handleChangeActive}
      icon={<RatingBox color={'primary'} />}
      // emptyIcon={<RatingBox fontSize="inherit" color={Color.greyLight} />}
      IconContainerComponent={getIconContainerWithColor(colorValue)}
    />
  )
}
