import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import RollVerifier from './RollVerifier'
import DiceRollContainer from './DiceRollContainer'
import { RichEditor } from '../rules/components/RichText'

export default function TestsPage() {
  return (
    <Box>
      <MainMenu currentPage="tests" />
      <DiceRollContainer />
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RollVerifier />
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RichEditor
          initialValue={
            '{"ops":[{"insert":"test "},{"attributes":{"underline":true},"insert":"value"},{"insert":"\\n"}]}'
          }
        />
      </Box>
      <Box marginTop="200px">test</Box>
    </Box>
  )
}
