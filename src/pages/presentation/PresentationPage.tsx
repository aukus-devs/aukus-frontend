import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayerUrl } from 'src/utils/types'
import Opening from './Opening'
import Closing from './Closing'
import PlayerPresentation from './PlayerPresentation'
import { useQuery } from '@tanstack/react-query'
import { fetchPlayers, fetchSponsors } from 'src/utils/api'
import { resetScroll } from './utils'

type PageType = PlayerUrl | 'start' | 'end'

const PagesList: PageType[] = [
  'start',
  'lasqa',
  'roadhouse',
  'browjey',
  'keliq_q',
  'krabick',
  'praden',
  'segall',
  'melharucos',
  'maddyson',
  'timofey',
  'unclebjorn',
  'vovapain',
  'uselessmouth',
  'end',
]

export default function PresentationPage() {
  const [pageIdx, setPageIdx] = useState<number>(PagesList.length - 1)

  const handleBack = () => {
    if (pageIdx > 0) {
      setPageIdx(pageIdx - 1)
      resetScroll()
    }
  }

  const handleNext = () => {
    if (pageIdx < PagesList.length - 1) {
      setPageIdx(pageIdx + 1)
      resetScroll()
    }
  }

  const { data: playersData } = useQuery({
    queryKey: ['playersCredits'],
    queryFn: () => fetchPlayers(),
    staleTime: 1000 * 60 * 60 * 3,
  })
  const players = playersData?.players

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsorsCredits'],
    queryFn: () => fetchSponsors(),
    staleTime: 1000 * 60 * 60 * 3,
  })
  const sponsors = sponsorsData?.dons

  if (!players || !sponsors) {
    return null
  }

  const page = PagesList[pageIdx]

  const getPageContent = (page: PageType) => {
    if (page === 'start') {
      return <Opening />
    }
    if (page === 'end') {
      return <Closing players={players} sponsors={sponsors} />
    }
    const player = players?.find((p) => p.url_handle === page)
    if (!player) {
      return null
    }
    const place = 13 - pageIdx + 1
    return <PlayerPresentation player={player} place={place} />
  }

  const pageContent = getPageContent(page)

  const showBack = pageIdx > 0
  const showNext = pageIdx < PagesList.length - 1

  const showMain = page !== 'end'

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="100%">
        <Box position="fixed" padding="40px" width="100%">
          <Box display="flex" justifyContent="space-between">
            {showBack ? (
              <Button
                onClick={handleBack}
                sx={{ width: '150px', height: '40px' }}
                color="customGreyDark"
              >
                Назад
              </Button>
            ) : (
              <Box width="150px" />
            )}
            {showMain && (
              <Link to="/">
                <Button
                  sx={{ width: '150px', height: '40px' }}
                  color="customGreyDark"
                >
                  На главную
                </Button>
              </Link>
            )}
            {showNext ? (
              <Button
                onClick={handleNext}
                sx={{ width: '150px', height: '40px' }}
                color="customGreyDark"
              >
                Дальше
              </Button>
            ) : (
              <Box width="150px" />
            )}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          {pageContent}
        </Box>
      </Box>
    </Box>
  )
}
