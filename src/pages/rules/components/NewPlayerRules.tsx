import { Box, Button } from '@mui/material'
import RichDisplay from './RichDisplay'
import { useQuery } from '@tanstack/react-query'
import { fetchRules } from 'src/utils/api'
import { useState } from 'react'
import RichEditor from './RichEditor2'

export default function PlayerRules() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  const { data: rulesData, refetch: refetchRules } = useQuery({
    queryKey: ['playerRules'],
    queryFn: fetchRules,
    enabled: mode === 'view',
    refetchInterval: 60 * 1000,
  })

  const rules = rulesData?.rules_data
  console.log('rules', rules)

  const handleCloseEditor = () => {
    setMode('view')
    refetchRules()
  }

  if (mode === 'view') {
    return (
      <Box>
        <Button onClick={() => setMode('edit')}>Редактировать</Button>
        <RichDisplay value={rules} />
      </Box>
    )
  }

  const handleTextChange = (value: string) => {
    console.log('handleTextChange', value)
  }

  return (
    <Box>
      <RichEditor initialValue={rules} onTextChange={handleTextChange} />
    </Box>
  )
}
