import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from 'src/context/UserProvider'
import WheelIcon from 'assets/icons/wheel.svg?react'
import DifficultyWheelModal from '../wheels/DifficultyWheelModal'
import SheikhWheelModal from '../wheels/SheikhWheelModal'
import MultistreamButton from 'src/components/QuickMenu/MultistreamButton'
import { EditModeButton } from '../PlayerCanvasBackground'
import useLocalStorage from 'src/context/useLocalStorage'
import ToggleButton from '../common/ToggleButton'
import { Color } from 'src/utils/types'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'

export default function QuickAccessButton() {
  const [open, setOpen] = useState(false)
  const [showDifficultyWheel, setShowDifficulteWheel] = useState(false)
  const [showSheikhMomentWheel, setShowSheikhMomentWheel] = useState(false)

  const { value: darkMode, save: saveDarkMode } = useLocalStorage({
    key: 'darkMode',
    defaultValue: false,
  })

  const buttonsMargin = '15px'
  const user = useUser()
  const { id: playerHandle } = useParams()

  const onPlayerPage = playerHandle

  let firstButton = (
    <a href="/login">
      <Button sx={{ width: '100%' }} color="info">
        Логин
      </Button>
    </a>
  )

  if (user && user.role === 'player') {
    firstButton = (
      <Link to={`/players/${user.url_handle}`}>
        <Button sx={{ width: '100%' }} color="info">
          Моя страница
        </Button>
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

  const switchMapDarkness = () => {
    saveDarkMode(!darkMode)
  }

  return (
    <>
      <Box
        width="131px"
        position="relative"
        onMouseLeave={() => setOpen(false)}
      >
        <Box
          sx={{
            backgroundColor: Color.greyDark,
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '8px',
            borderRadius: '5px',
            display: 'flex',
            fontSize: '12px',
            fontWeight: '600',
            alignItems: 'center',
            color: Color.greyText2,
          }}
          onMouseOver={() => setOpen(true)}
        >
          Быстрый доступ
          {open ? <ArrowDropUp width="14px" /> : <ArrowDropDown width="14px" />}
        </Box>
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
                  <Button
                    sx={{ width: '100%' }}
                    onClick={openDifficultyWheel}
                    color="info"
                  >
                    <WheelIcon
                      style={{
                        marginRight: '8px',
                        width: '19px',
                        height: '19px',
                      }}
                    />
                    Колесо сложности
                  </Button>
                </Box>
                <Box marginTop={buttonsMargin}>
                  <Button
                    onClick={openSheikhMomentWheel}
                    sx={{ width: '100%' }}
                    color="info"
                  >
                    <WheelIcon
                      style={{
                        marginRight: '8px',
                        width: '19px',
                        height: '19px',
                      }}
                    />
                    Колесо шейх-момента
                  </Button>
                </Box>
              </>
            )}
            <Box marginTop={buttonsMargin}>
              <MultistreamButton />
            </Box>
            <Box marginTop={buttonsMargin}>
              <ToggleButton
                color="info"
                toggled={darkMode}
                onClick={switchMapDarkness}
                sx={{ width: '100%' }}
              >
                Затемнить карту
              </ToggleButton>
            </Box>
            <Box marginTop={buttonsMargin}>
              <Button color="info" sx={{ width: '100%' }}>
                Таймлапс
              </Button>
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
