import { Box } from '@mui/material'
import { PlayerPhotoMap } from './utils'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPlayers } from 'src/utils/api'
import PlayerTile from './PlayerTile'

export default function PlayerListTiles() {
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

  return (
    <Box display={'flex'} justifyContent={'center'} width={'100%'}>
      <Box display={'flex'} flexWrap={'wrap'} maxWidth={'1190px'} gap={'25px'}>
        {players.map((player) => {
          const hasPhoto = PlayerPhotoMap[player.url_handle]
          if (!hasPhoto) {
            return null
          }
          return (
            <Box key={player.id}>
              <PlayerTile player={player} />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
