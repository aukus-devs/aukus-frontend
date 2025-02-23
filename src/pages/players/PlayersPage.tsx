import { Box, Button } from '@mui/material'
import BottomSection from 'src/components/common/BottomSection'
import MainMenu from 'components/MainMenu'
import PlayerList from './components/PlayerList'
import useScreenSize from 'src/context/useScreenSize'
import MultistreamButton from '../../components/QuickMenu/MultistreamButton'
import PlayerListTiles from './components/PlayerListTiles'

type Params = {
  tiled?: boolean
}

export default function PlayersPage({ tiled }: Params) {
  const { isMobile } = useScreenSize()

  if (isMobile) {
    return (
      <Box>
        <MainMenu currentPage="players" />
        <Box marginTop={'100px'} />
        <PlayerList />
        <BottomSection />
      </Box>
    )
  }

  return (
    <Box>
      <MainMenu currentPage="players" />
      <Box marginTop={'100px'} />
      {tiled ? <PlayerListTiles /> : <PlayerList />}
      <BottomSection />
    </Box>
  )
}
