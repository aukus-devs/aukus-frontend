import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { useState } from 'react'
import DifficultyWheel from './DifficultyWheel'
import WheelIcon from 'assets/icons/wheel.svg?react'
import { Close } from '@mui/icons-material'
import SheikhWheel from './SheikhWheel'
import { Link } from 'react-router-dom'
import LinkSpan from 'src/components/LinkSpan'
import { Color } from 'src/utils/types'

export default function WheelButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const [wheelType, setWheelType] = useState<'difficulty' | 'sheikh'>(
    'difficulty'
  )

  const resetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    target.scrollTop = 0
  }

  return (
    <>
      <Button
        sx={{ width: '207px', paddingLeft: '15px', paddingRight: '15px' }}
        onClick={() => setModalOpen(true)}
      >
        <WheelIcon
          style={{ marginRight: '8px', width: '19px', height: '19px' }}
        />
        Колеса
      </Button>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
      >
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
            <Box marginRight="50px">
              <Link to="#" onClick={() => setWheelType('difficulty')}>
                <LinkSpan
                  color={Color.blue}
                  active={wheelType === 'difficulty'}
                >
                  Ролл сложности
                </LinkSpan>
              </Link>
            </Box>
            <Box>
              <Link to="#" onClick={() => setWheelType('sheikh')}>
                <LinkSpan color={Color.orange} active={wheelType === 'sheikh'}>
                  Ролл шейх-момента
                </LinkSpan>
              </Link>
            </Box>
            <Box position={'absolute'} right={'40px'}>
              <IconButton
                aria-label="close"
                onClick={() => setModalOpen(false)}
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
          {wheelType === 'difficulty' && <DifficultyWheel />}
          {wheelType === 'sheikh' && <SheikhWheel />}
        </DialogContent>
      </Dialog>
    </>
  )
}
