import {
  createTheme,
  CssBaseline,
  PaletteColor,
  Theme,
  ThemeProvider,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser } from 'utils/api'
import { Color, CurrentUser } from 'utils/types'

const UserContext = createContext<CurrentUser | null>(null)

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [playerInfo, setPlayerInfo] = useState<CurrentUser | null>(null)

  const { data: currentUserData } = useQuery({
    queryKey: ['current_user'],
    queryFn: fetchCurrentUser,
    enabled: !playerInfo,
    staleTime: 1000 * 60,
    retry: false,
  })

  useEffect(() => {
    if (currentUserData) {
      setPlayerInfo(currentUserData)
    }
  }, [currentUserData])

  const buttonColor =
    playerInfo?.name === 'UselessMouth' ? Color.pink : Color.blue

  let darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: buttonColor,
      },
      secondary: {
        main: '#007AFF',
      },
      info: {
        main: Color.greyLight,
      },
      text: {
        primary: '#fff',
        secondary: '#a6d4fa',
      },
      background: {
        default: '#0c0c0c',
      },
    },
    typography: {
      fontFamily: '"Golos Text", sans-serif',
      fontWeightRegular: 600,
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          color: 'primary',
          disableElevation: true,
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  })

  darkTheme = createTheme(darkTheme, {
    palette: makeCustomColors(darkTheme, Color),
  })

  return (
    <UserContext.Provider value={playerInfo}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </UserContext.Provider>
  )
}

function makeCustomColors(theme: Theme, colors: { [key: string]: string }) {
  const transformedColors: { [key: string]: PaletteColor } = {}

  Object.entries(colors).forEach(([key, value]) => {
    const customKey = `custom${key.charAt(0).toUpperCase()}${key.slice(1)}`

    transformedColors[customKey] = theme.palette.augmentColor({
      color: { main: value },
      name: customKey,
    })
  })

  return transformedColors
}
