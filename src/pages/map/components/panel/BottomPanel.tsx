import { Box } from '@mui/material'
import { Color, Player } from 'src/utils/types'
import FormControl from './FormControl'

type Props = {
  children?: React.ReactNode
}

export default function BottomPanel({ children }: Props) {
  return (
    <Box
      position="fixed"
      bottom="0px"
      left="0px"
      width="100%"
      display="flex"
      justifyContent="center"
      zIndex="50"
      // zIndex="5000"
      sx={{ pointerEvents: 'none' }}
    >
      <Box
        // width="700px"
        // height="350px"
        // border="1px solid white"
        sx={{
          backgroundColor: Color.greyDark,
          // zIndex: 5000,
          pointerEvents: 'auto',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
