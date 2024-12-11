import { Box } from '@mui/material'
import BottomSection from 'components/BottomSection'
import MainMenu from 'components/MainMenu'
import Leaderboard from './components/Leaderboard'
import useScreenSize from 'src/context/useScreenSize'
import LeaderboardMobile from './components/LeaderboardMobile'
import StatsTable from './components/StatsTable'

export default function StatsPage() {
  const { isMobile } = useScreenSize()
  return (
    <Box>
      <MainMenu currentPage="stats" />
      <Box marginTop={'100px'} />
      {isMobile ? (
        <LeaderboardMobile />
      ) : (
        <>
          <Leaderboard />
          <Box marginTop={'50px'}>
            <StatsTable />
          </Box>
        </>
      )}
      <BottomSection />
    </Box>
  )
}
