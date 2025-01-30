import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import RollVerifier from './RollVerifier'
import DiceRollContainer from './DiceRollContainer'
import RichEditor from '../rules/components/RichEditor2'

export default function TestsPage() {
  return (
    <Box>
      <MainMenu currentPage="tests" />
      <DiceRollContainer />
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RollVerifier />
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RichEditor />
      </Box>
    </Box>
  )
}
