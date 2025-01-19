import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import TimedButton from './TimedButton'
import RollVerifier from './RollVerifier'
import RotatingCube from './RotatingCube'
import CubesGroup from './CubesGroup'
import DiceRollContainer from './DiceRollContainer'
import { RichEditor } from './RichEditor'
import RichDisplay from './RichDisplay'
import useLocalStorage from 'src/context/useLocalStorage'
import { useState } from 'react'

export default function TestsPage() {
  const { load } = useLocalStorage()
  const [richData] = useState(load('rich_content', []))

  return (
    <Box>
      <MainMenu currentPage="tests" />
      <DiceRollContainer />
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RollVerifier />
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <RichEditor initialValue={richData.length > 0 ? richData : undefined} />
      </Box>

      <Box display="flex" justifyContent="center" marginTop="50px">
        <RichDisplay data={richData} />
      </Box>
    </Box>
  )
}
