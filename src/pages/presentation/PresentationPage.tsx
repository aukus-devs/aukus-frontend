import { Box, Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayerColor, PlayerUrl } from 'src/utils/types'
import Opening from './Opening'
import Closing from './Closing'
import PlayerPresentation from './PlayerPresentation'
import { useQuery } from '@tanstack/react-query'
import { fetchPlayers, fetchSponsors } from 'src/utils/api'
import { resetScroll } from './utils'
import usePlayersScores from 'src/context/usePlayersScores'
import StarImage from 'assets/big_star.svg?react'

type PageType = PlayerUrl | 'start' | 'end'

export default function PresentationPage() {
  const [pageIdx, setPageIdx] = useState<number>(0)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonItem, setButtonItem] = useState<HTMLButtonElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        setButtonItem(buttonRef.current)
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  let buttonLeft = null
  let buttonTop = null
  if (buttonItem) {
    const rect = buttonItem.getBoundingClientRect()
    buttonLeft = rect.left + rect.width / 2
    buttonTop = rect.top + rect.height / 2
  }

  const { players, scoreByPlayerId, winner } = usePlayersScores()

  let playersOrderedByScore = players.sort((a, b) => {
    const aScore = scoreByPlayerId[a.id]
    const bScore = scoreByPlayerId[b.id]
    return aScore - bScore
  })

  if (winner) {
    // put winner in the end
    playersOrderedByScore = playersOrderedByScore.filter(
      (p) => p.id !== winner.id
    )
    playersOrderedByScore.push(winner)
  }

  const PAGES_COUNT = playersOrderedByScore.length + 2

  const handleBack = () => {
    if (pageIdx > 0) {
      setPageIdx(pageIdx - 1)
      resetScroll()
    }
    const music = document.getElementById(
      'credits-music'
    ) as HTMLAudioElement | null
    if (music) {
      music.pause()
    }
  }

  const handleNext = () => {
    if (pageIdx < PAGES_COUNT - 1) {
      setPageIdx(pageIdx + 1)
      resetScroll()
    }
  }

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsorsCredits'],
    queryFn: () => fetchSponsors(),
    staleTime: 1000 * 60 * 60 * 3,
  })
  const sponsors = sponsorsData?.dons || []

  const getPageContent = (pageId: number) => {
    if (pageId === 0) {
      return <Opening />
    }
    if (pageId === PAGES_COUNT - 1) {
      return <Closing players={players} sponsors={sponsors} />
    }
    const player = playersOrderedByScore[pageId - 1]
    if (!player) {
      return null
    }
    const place = players.length - pageId + 1
    return <PlayerPresentation player={player} place={place} />
  }

  const pageContent = getPageContent(pageIdx)

  const showBack = pageIdx > 0
  const showNext = pageIdx < PAGES_COUNT - 1

  const showMain = pageIdx !== PAGES_COUNT - 1

  let currentPlayerColor = null
  if (pageIdx > 0 && pageIdx < PAGES_COUNT - 1) {
    const currentPlayer = playersOrderedByScore[pageIdx - 1]
    currentPlayerColor = getPlayerColor(currentPlayer.url_handle)
  }

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="100%">
        {currentPlayerColor && buttonTop && buttonLeft && (
          <Box
            position="fixed"
            left={`${buttonLeft - 500}px`}
            top={`${buttonTop - 500}px`}
            zIndex={-1}
          >
            <StarImage color={currentPlayerColor} />
          </Box>
        )}
        <Box position="fixed" padding="40px" width="100%" zIndex="30">
          <Box
            display="flex"
            justifyContent="space-between"
            position="relative"
          >
            {showBack ? (
              <Button
                onClick={handleBack}
                sx={{ width: '170px', height: '40px' }}
                color="customGreyDark"
              >
                Назад
              </Button>
            ) : (
              <Box width="170px" />
            )}
            {showMain && (
              <Link to="/">
                <Button
                  sx={{ width: '170px', height: '40px' }}
                  color="customGreyDark"
                >
                  На главную
                </Button>
              </Link>
            )}
            {showNext ? (
              <Button
                onClick={handleNext}
                sx={{ width: '170px', height: '40px' }}
                color="customGreyDark"
                ref={buttonRef}
              >
                Дальше ({pageIdx + 1}/{PAGES_COUNT})
              </Button>
            ) : (
              <Box width="170px" />
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
