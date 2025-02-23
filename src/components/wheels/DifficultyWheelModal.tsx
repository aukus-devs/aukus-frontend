import { Close } from '@mui/icons-material'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import DifficultyWheel from './DifficultyWheel'

type Props = {
  open: boolean
  onClose: () => void
}

export default function DifficultyWheelModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ padding: 0, margin: 0 }}>
        <Box
          width={'100%'}
          // fontSize={'32px'}
          marginTop="20px"
          marginBottom="20px"
          display={'flex'}
          position="relative"
          justifyContent="center"
          textAlign="center"
        >
          Ролл сложности для <br /> *название игры*
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
        <DifficultyWheel />
      </DialogContent>
    </Dialog>
  )
}
