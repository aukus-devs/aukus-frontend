import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { shuffle } from 'lodash'
import { useState } from 'react'
import { fetchPlayers } from 'utils/api'
import PlayerSection from './PlayerSection'
import { PlayerPhotoMap } from './utils'

export default function PlayerList() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [fetchStart] = useState(Date.now())

  const { data: playersData } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(),
    staleTime: 1000 * 60 * 5,
  })
  const players = playersData?.players

  if (!players) {
    if (Date.now() - fetchStart > 1000) {
      return <div>Загрузка...</div>
    }
    return null
  }

  const randomPlayers = shuffle(players)

  return (
    <Box
      sx={isDesktop ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        columnGap: '30px',
        width: 'fit-content',
        margin: '0 auto'
      } : {
        margin: '0 10px'
      }}
    >
      {randomPlayers.map((player) => {
        const hasPhoto = PlayerPhotoMap[player.url_handle]
        if (!hasPhoto) {
          return null
        }
        return (
          <Box key={player.id} marginBottom={'150px'}>
            <PlayerSection player={player} />
          </Box>
        )
      })}
    </Box>
  )
}
