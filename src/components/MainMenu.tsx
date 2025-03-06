import React, { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { useUser } from 'context/UserProvider'
import { Link, ScrollRestoration } from 'react-router-dom'
import { Color, getPlayerColor, Page } from 'utils/types'
import SnowflakeIcon from 'assets/snowflake.svg?react'
import SpecialBackground from 'assets/button-special.png'
import { TWallpaper } from '@twallpaper/react'
import '@twallpaper/react/css'
import LinkSpan from './common/LinkSpan'
import useScreenSize from 'src/context/useScreenSize'
import MainMenuMobile from './MainMenuMobile'
import Clock from './Clock'
import { useTime } from 'src/context/TimeProvider'
import { playerDisplayName } from 'src/pages/player/components/utils'
import useLocalStorage from 'src/context/useLocalStorage'
import useEventState from 'src/context/useEventState'
import QuickAccessButton from './QuickMenu/QuickAccessButton'

type Props = {
  currentPage: Page
  replaceMenuButtons?: React.ReactNode
}

// interval of 1 hour in ms
const refreshInterval = 1000 * 60 * 60

export default function MainMenu({ currentPage, replaceMenuButtons }: Props) {
  const currentUser = useUser()
  const { isMobile } = useScreenSize()
  const playerColor = currentUser?.url_handle
    ? getPlayerColor(currentUser.url_handle)
    : Color.blueLight
  const urlHandle = currentUser?.url_handle

  const { value: snowState, save: saveSnowState } = useLocalStorage({
    key: 'snowLevel',
    defaultValue: 'off',
  })

  const eventState = useEventState()
  const eventFinished = eventState.state === 'finished'

  const cycleSnow = () => {
    if (snowState === 'off' || !snowState) {
      saveSnowState('small')
    } else if (snowState === 'small') {
      saveSnowState('big')
    } else {
      saveSnowState('off')
    }
  }

  const time = useTime()

  useEffect(() => {
    if (time?.loadTime) {
      // console.log('time.loadTime', Date.now() - time.loadTime)
      if (Date.now() - time.loadTime > refreshInterval) {
        window.location.reload()
      }
    }
  }, [time])

  const enableScrollRestoration = currentPage !== 'map'

  if (isMobile) {
    return <MainMenuMobile currentPage={currentPage} />
  }

  const userTitle = currentUser ? playerDisplayName(currentUser) : 'Зритель'

  return (
    <>
      {enableScrollRestoration && <ScrollRestoration />}
      <TWallpaper
        options={{
          fps: 1,
          tails: 5,
          animate: false,
          scrollAnimate: false,
          colors: ['#1c1c1c', '#1c1c1c', '#1c1c1c', '#1c1c1c'],
          pattern: {
            image: 'https://twallpaper.js.org/patterns/games.svg',
            background: '#0c0c0c',
            blur: 0,
            size: '470px',
            opacity: 1,
            mask: true,
          },
        }}
      />
      <Box
        display="flex"
        justifyContent="center"
        textAlign={'center'}
        marginTop={'0px'}
        marginBottom={'13px'}
        textTransform={'uppercase'}
        width={'100%'}
        position="relative"
        zIndex={20}
      >
        <Box position="relative" width="fit-content" style={{ height: '24px' }}>
          <span style={{ display: 'inline-flex' }}>
            {snowState !== 'off' && (
              <snow-effect
                color="white"
                flakes={snowState === 'small' ? 50 : 150}
                speed={1}
              />
            )}

            <SnowflakeIcon
              width={'15px'}
              height={'15px'}
              style={{
                marginRight: '8px',
                alignSelf: 'center',
                cursor: 'pointer',
              }}
              onClick={cycleSnow}
            />

            <span
              style={{
                fontWeight: 600,
                paddingBottom: 0,
                lineHeight: '1.2',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              АУКУС 2024
            </span>
          </span>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent={'start'}
        zIndex={200}
        position="sticky"
        top="0"
        margin="auto"
        width="fit-content"
      >
        <Box
          padding={'10px'}
          display="flex"
          alignItems={'center'}
          sx={{ backgroundColor: Color.greyDark }}
          borderRadius="15px"
          height={'60px'}
          position="relative"
        >
          {replaceMenuButtons || (
            <>
              <Box
                marginRight="30px"
                top="0px"
                position="absolute"
                right="100%"
              >
                <Box color={Color.greyText2} fontSize="14px" fontWeight="600">
                  <Clock />
                </Box>
                <Box fontSize="24px" fontWeight="700" marginBottom="20px">
                  {userTitle}
                </Box>
                <QuickAccessButton />
              </Box>

              {eventFinished && (
                <Link to="/presentation" style={{ marginRight: 10 }}>
                  <Button
                    color={currentPage === 'about' ? 'primary' : 'info'}
                    sx={{ width: '150px', height: '40px' }}
                    style={{
                      backgroundImage: `url(${SpecialBackground})`,
                    }}
                  >
                    Итоги
                  </Button>
                </Link>
              )}

              <Link to="/" style={{ marginRight: 10 }}>
                <Button
                  color={currentPage === 'map' ? 'primary' : 'info'}
                  sx={{ width: '150px', height: '40px' }}
                >
                  Карта
                </Button>
              </Link>

              <Link
                to="/stats"
                style={{ marginRight: 10, textDecoration: 'none' }}
              >
                <Button
                  color={currentPage === 'stats' ? 'primary' : 'info'}
                  sx={{ width: '150px', height: '40px' }}
                >
                  Лидеры
                </Button>
              </Link>

              <Link to="/players" style={{ marginRight: 10 }}>
                <Button
                  color={
                    ['players', 'player'].includes(currentPage)
                      ? 'primary'
                      : 'info'
                  }
                  sx={{ width: '150px', height: '40px' }}
                >
                  Участники
                </Button>
              </Link>

              <Link to="/rules" style={{ marginRight: 10 }}>
                <Button
                  color={currentPage === 'rules' ? 'primary' : 'info'}
                  sx={{ width: '150px', height: '40px' }}
                >
                  Правила
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  color={currentPage === 'about' ? 'primary' : 'info'}
                  sx={{ width: '150px', height: '40px' }}
                >
                  Создатели
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
