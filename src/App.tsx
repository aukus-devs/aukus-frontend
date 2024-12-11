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
      element: <PlayersPage tiled />,
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

function App() {
  const queryClient = new QueryClient()
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <UserProvider>
            <TimeProvider>
              <RouterProvider router={router} />
            </TimeProvider>
          </UserProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default App
