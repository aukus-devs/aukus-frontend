import { Box } from '@mui/material'
import { Color } from 'src/utils/types'

export default function SheikhWheel() {
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
          src="https://wheelofnames.com/ru/th2-utw"
          title="Колесо шейх-момента"
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
