import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import shuffle from 'lodash/shuffle'
import { useState } from 'react'
import { fetchPlayers } from 'utils/api'
import PlayerSection from './PlayerSection'
import { PlayerPhotoMap } from './utils'

export default function PlayerList() {
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
    <Box marginLeft={'10px'} marginRight={'10px'}>
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
