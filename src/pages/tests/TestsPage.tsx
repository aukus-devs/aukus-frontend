import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import RollVerifier from './RollVerifier'
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
