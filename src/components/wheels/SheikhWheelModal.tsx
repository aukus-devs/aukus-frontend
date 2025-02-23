import { Close } from '@mui/icons-material'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import SheikhWheel from './SheikhWheel'

type Props = {
  open: boolean
  onClose: () => void
}

export default function SheikhWheelModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ padding: 0, margin: 0 }}>
        <Box
          width="100%"
          // fontSize={'32px'}
          marginBottom="20px"
          display="flex"
          position="relative"
          marginTop="20px"
          justifyContent="center"
          textAlign="center"
        >
          Ролл Шейх-момента для <br /> *название игры*
          <Box position={'absolute'} right={'40px'}>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                padding: 0,
                color: 'white',
              }}
            >
              <Close sx={{ fontSize: '29px' }} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        <SheikhWheel />
      </DialogContent>
    </Dialog>
  )
}
