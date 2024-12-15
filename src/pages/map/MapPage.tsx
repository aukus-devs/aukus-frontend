import { Box } from '@mui/material'
import BottomSection from 'components/BottomSection'
import MainMenu from 'components/MainMenu'
import MapComponent from './components/MapComponent'
import TimelapseProvider from './hooks/useTimelapse'
import useScreenSize from 'src/context/useScreenSize'
import MapComponentMobile from './components/MapComponentMobile'
import WheelButton from '../rules/components/WheelButton'
import { useUser } from 'src/context/UserProvider'

export default function MapPage() {
  const { isMobile, width } = useScreenSize()
  const mapWidth = 1715

  if (isMobile) {
    return (
      <Box>
        <MainMenu currentPage={'map'} />
        <MapComponentMobile />
        <BottomSection />
      </Box>
    )
  }

  if (width < mapWidth) {
    return (
      <Box width={'fit-content'}>
        <MainMenu currentPage={'map'} />
        <Box
          alignContent={'center'}
          display="flex"
          alignItems="center"
          justifyContent={'start'}
          margin={'auto'}
          marginTop={'50px'}
          width={'fit-content'}
        >
          <TimelapseProvider>
            <MapComponent />
          </TimelapseProvider>
        </Box>
        <BottomSection />
      </Box>
    )
  }

  return (
    <Box>
      <MainMenu currentPage={'map'} />
      <Box
        alignContent={'center'}
        display="flex"
        alignItems="center"
        justifyContent={'center'}
        margin={'auto'}
        marginTop={'50px'}
        width={'100%'}
      >
        <TimelapseProvider>
          <MapComponent />
        </TimelapseProvider>
      </Box>
      <BottomSection />
    </Box>
  )
}
