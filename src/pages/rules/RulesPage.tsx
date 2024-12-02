import { Box } from '@mui/material'
import BottomSection from 'components/BottomSection'
import MainMenu from 'components/MainMenu'
import RulesContainer from './components/RulesConainer'

export default function RulesPage() {
  return (
    <Box>
      <MainMenu currentPage={'rules'} />
      <Box marginTop={'100px'} />
      <RulesContainer />
      <BottomSection />
    </Box>
  )
}
