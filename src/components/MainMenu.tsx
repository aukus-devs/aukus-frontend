import React, { useContext, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { useUser } from 'context/UserProvider'
import { Link, ScrollRestoration } from 'react-router-dom'
import { Color, getPlayerColor, Page } from 'utils/types'
import SnowflakeIcon from 'assets/snowflake.svg?react'
import { TWallpaper } from '@twallpaper/react'
import '@twallpaper/react/css'
import LinkSpan from './LinkSpan'
import useScreenSize from 'src/context/useScreenSize'
import MainMenuMobile from './MainMenuMobile'
import Clock from './Clock'
import FloatingClock from './FloatingClock'
import MultistreamButton from 'src/pages/players/components/MultistreamButton'
import DifficultyButton from 'src/pages/rules/components/DifficultyButton'
import { useTime } from 'src/context/TimeProvider'
import { playerDisplayName } from 'src/pages/player/components/utils'

type Props = {
  currentPage: Page
  replaceMenuButtons?: React.ReactNode
  rightSlot?: React.ReactNode
  leftSlot?: React.ReactNode
}

// interval of 1 hour in ms
const refreshInterval = 1000 * 60 * 60

export default function MainMenu({
  currentPage,
  replaceMenuButtons,
  rightSlot,
  leftSlot,
}: Props) {
  const currentUser = useUser()
  const { isMobile } = useScreenSize()
  const playerColor = currentUser?.url_handle
    ? getPlayerColor(currentUser.url_handle)
    : Color.blueLight
  const urlHandle = currentUser?.url_handle

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

  if (!leftSlot && currentUser) {
    leftSlot = <DifficultyButton />
  }

  if (!rightSlot) {
    rightSlot = <MultistreamButton />
  }

  return (
    <Box>
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
        <Box position="relative" width="fit-content">
          <Box
            fontWeight={600}
            position="absolute"
            display="inline"
            marginRight={'15px'}
            top={'1px'}
            left={'-325px'}
            width={'max-content'}
            style={{
              lineHeight: '1.2',
            }}
            color={'#656565'}
          >
            {/* До конца ивента: 24 дня 20 часов */}
          </Box>
          <Link to={urlHandle ? `/players/${urlHandle}` : '/'}>
            <LinkSpan
              color={playerColor}
              style={{
                fontWeight: 600,
                paddingBottom: 0,
                lineHeight: '1.2',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SnowflakeIcon
                width={'15px'}
                height={'15px'}
                style={{ marginRight: '8px' }}
              />
              АУКУС 2024 {currentUser && `// ${playerDisplayName(currentUser)}`}
            </LinkSpan>
          </Link>
          <Box
            fontWeight={600}
            position="absolute"
            display="inline"
            marginLeft={'15px'}
            top={'1px'}
            style={{
              lineHeight: '1.2',
              width: 'max-content',
            }}
            color={Color.greyText}
          >
            <Clock />
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent={'start'}
        zIndex={20}
        position="relative"
        margin={'auto'}
        width={'fit-content'}
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
              {leftSlot && (
                <Box marginRight={'30px'} position="absolute" right="100%">
                  {leftSlot}
                </Box>
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

          {rightSlot && (
            <Box marginLeft={'30px'} position="absolute" left="100%">
              {rightSlot}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
