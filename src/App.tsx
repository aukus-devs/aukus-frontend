import {
  createTheme,
  CssBaseline,
  PaletteColor,
  ThemeProvider,
} from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from 'context/UserProvider'
import AboutPage from 'pages/about/AboutPage'
import RulesPage from 'pages/rules/RulesPage'
import StatsPage from 'pages/stats/StatsPage'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Color, CustomColorOverrides } from 'utils/types'
import './App.css'
import MapPage from './pages/map/MapPage'
import PlayerPage from './pages/player/PlayerPage'
import PlayersPage from './pages/players/PlayersPage'
import { SnackbarProvider } from 'notistack'
import NotFound from './pages/NotFound'
import { TimeProvider } from './context/TimeProvider'

// Update the Button's color options types
declare module '@mui/material/Button' {
  // eslint-disable-next-line
  interface ButtonPropsColorOverrides extends CustomColorOverrides {}
}

declare module '@mui/material/Checkbox' {
  // eslint-disable-next-line
  interface CheckboxPropsColorOverrides extends CustomColorOverrides {}
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MapPage />,
    },
    {
      path: '/players',
      element: <PlayersPage />,
    },
    {
      path: '/players2',
      element: <PlayersPage tiled />,
    },
    {
      path: '/players/:id',
      element: <PlayerPage />,
    },
    {
      path: '/rules/*',
      element: <RulesPage />,
    },
    {
      path: '/about',
      element: <AboutPage />,
    },
    {
      path: '/stats',
      element: <StatsPage />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
  { basename: '/' }
)

let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: Color.blue,
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

const makeCustomColors = (colors: { [key: string]: string }) => {
  const transformedColors: { [key: string]: PaletteColor } = {}

  Object.entries(colors).forEach(([key, value]) => {
    const customKey = `custom${key.charAt(0).toUpperCase()}${key.slice(1)}`

    transformedColors[customKey] = darkTheme.palette.augmentColor({
      color: { main: value },
      name: customKey,
    })
  })

  return transformedColors
}

darkTheme = createTheme(darkTheme, {
  palette: makeCustomColors(Color),
})

function App() {
  const queryClient = new QueryClient()
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <UserProvider>
              <TimeProvider>
                <RouterProvider router={router} />
              </TimeProvider>
            </UserProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default App
