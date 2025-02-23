import { Box } from '@mui/material'
import BottomSection from 'src/components/common/BottomSection'
import MainMenu from 'components/MainMenu'
import AboutContent from './components/AboutContent'

export default function AboutPage() {
  return (
    <Box>
      <MainMenu currentPage={'about'} />
      <Box marginTop={'100px'} />
      <AboutContent />
      <BottomSection />
    </Box>
  )
}
