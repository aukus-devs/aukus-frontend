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
  const resetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    target.scrollTop = 0
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle style={{ padding: 0, margin: 0 }}>
        <Box
          width={'100%'}
          // fontSize={'32px'}
          marginBottom={'0px'}
          display={'flex'}
          position={'relative'}
          marginTop={'20px'}
          justifyContent={'center'}
        >
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
      <DialogContent style={{ overflow: 'hidden' }} onScroll={resetScroll}>
        <DifficultyWheel />
      </DialogContent>
    </Dialog>
  )
}
