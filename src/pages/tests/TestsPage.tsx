import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import TimedButton from './TimedButton'
import RollVerifier from './RollVerifier'
import RotatingCube from './RotatingCube'
import CubesGroup from './CubesGroup'
import DiceRollContainer from './DiceRollContainer'

export default function TestsPage() {
  return (
    <Box>
      <MainMenu currentPage="tests" />
      <DiceRollContainer />
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RollVerifier />
      </Box>
    </Box>
  )
}
