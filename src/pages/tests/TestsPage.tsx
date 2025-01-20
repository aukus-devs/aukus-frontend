import { Box } from '@mui/material'
import MainMenu from 'src/components/MainMenu'
import RollVerifier from './RollVerifier'
import DiceRollContainer from './DiceRollContainer'
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
    </Box>
  )
}
