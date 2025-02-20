import { Box } from '@mui/material'
import { Color } from 'src/utils/types'
import Wheel from '../wheel/Wheel'

export default function DifficultyWheel() {
  const options = [
    {
      title: 'Нормальная',
      value: 'normal',
      color: Color.green,
    },
    {
      title: 'Сложная',
      value: 'hard',
      color: Color.red,
    },
    {
      title: 'Очень сложная',
      value: 'very-hard',
      color: Color.red,
    },
    {
      title: 'Легкая',
      value: 'easy',
      color: Color.green,
    },
  ]

  return (
    <Wheel
      options={options}
      onAnimationEnd={(winner) => {
        console.log('test', winner)
      }}
    />
  )

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box
        style={{
          position: 'absolute',
          width: '700px',
          backgroundColor: Color.greyDark,
          height: '10px',
          // display: 'none',
        }}
      />
      <Box>
        <iframe
          src="https://wheelofnames.com/ru/stm-kge"
          title="Колесо сложности"
          width={'700px'}
          height={'700px'}
          style={{
            border: 'none',
            padding: 0,
            margin: 0,
            overflow: 'hidden',
          }}
        />
      </Box>
    </Box>
  )
}
