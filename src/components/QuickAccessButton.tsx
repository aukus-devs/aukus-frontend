import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from 'src/context/UserProvider'
import DifficultyWheelModal from './wheels/DifficultyWheelModal'
import SheikhWheelModal from './wheels/SheikhWheelModal'
import MultistreamButton from 'src/components/quick_menu/MultistreamButton'
import { EditModeButton } from './PlayerCanvasBackground'

export default function QuickAccessButton() {
  const [open, setOpen] = useState(false)
  const [showDifficultyWheel, setShowDifficulteWheel] = useState(false)
  const [showSheikhMomentWheel, setShowSheikhMomentWheel] = useState(false)

  const buttonsMargin = '15px'
  const user = useUser()
  const { id: playerHandle } = useParams()

  const onPlayerPage = playerHandle

  let firstButton = (
    <Link to="/login">
      <Button>Логин</Button>
    </Link>
  )

  if (user && user.role === 'player') {
    firstButton = (
      <Link to={`/players/${user.url_handle}`}>
        <Button>Моя страница</Button>
      </Link>
    )
  }

  const canEditPlayerPage =
    user &&
    (user.role === 'moder' ||
      user.role === 'admin' ||
      user.url_handle === playerHandle)

  if (onPlayerPage && canEditPlayerPage) {
    firstButton = <EditModeButton />
  }

  const openDifficultyWheel = () => {
    setShowDifficulteWheel(true)
  }

  const openSheikhMomentWheel = () => {
    setShowSheikhMomentWheel(true)
  }

  return (
    <>
      <Box
        width="170px"
        position="relative"
        onMouseLeave={() => setOpen(false)}
      >
        <Button onClick={() => setOpen(!open)}>Быстрый доступ</Button>
        {open && (
          <Box
            position="absolute"
            top="100%"
            left="-50px"
            width="300px"
            paddingTop="30px"
            paddingBottom="30px"
            paddingLeft="50px"
          >
            <Box>{firstButton}</Box>
            {user && (
              <>
                <Box marginTop={buttonsMargin}>
                  <Button onClick={openDifficultyWheel}>
                    Колесо сложности
                  </Button>
                </Box>
                <Box marginTop={buttonsMargin}>
                  <Button onClick={openSheikhMomentWheel}>
                    Колесо шейх-момента
                  </Button>
                </Box>
              </>
            )}
            <Box marginTop={buttonsMargin}>
              <MultistreamButton />
            </Box>
            <Box marginTop={buttonsMargin}>
              <Button>Затемнить карту</Button>
            </Box>
            <Box marginTop={buttonsMargin}>
              <Button>Таймлапс</Button>
            </Box>
          </Box>
        )}
      </Box>
      <DifficultyWheelModal
        open={showDifficultyWheel}
        onClose={() => setShowDifficulteWheel(false)}
      />
      <SheikhWheelModal
        open={showSheikhMomentWheel}
        onClose={() => setShowSheikhMomentWheel(false)}
      />
    </>
  )
}
