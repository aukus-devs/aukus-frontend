import { Box } from '@mui/material'
import { Color } from 'src/utils/types'

export default function DifficultyWheel() {
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
