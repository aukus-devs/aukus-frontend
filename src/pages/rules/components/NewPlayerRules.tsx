import { Box, Button } from '@mui/material'
import RichDisplay from './RichDisplay'
import { useQuery } from '@tanstack/react-query'
import { fetchRules } from 'src/utils/api'
import { SlateElement } from 'src/types/slate'
import { useState } from 'react'
import { RichEditor } from './RichEditor'

const defaultRules: SlateElement[] = [
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Загрузка правил...' }],
  },
]

export default function PlayerRules() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  const { data: rulesData } = useQuery({
    queryKey: ['playerRules'],
    queryFn: fetchRules,
    enabled: mode === 'view',
    refetchInterval: 60 * 1000,
  })

  const rules = rulesData?.rules_data
  let rulesParsed: SlateElement[] = defaultRules

  if (rules) {
    try {
      rulesParsed = JSON.parse(rules)
    } catch (e) {
      console.error('Error parsing rules:', e)
    }
  }

  // check if rules parsed into array with at least one element
  if (!Array.isArray(rulesParsed) || rulesParsed.length === 0) {
    console.error('Invalid rules data:', rulesParsed)
    rulesParsed = defaultRules
  }

  if (mode === 'view') {
    return (
      <Box>
        <Button onClick={() => setMode('edit')}>Редактировать</Button>
        <RichDisplay data={rulesParsed} />
      </Box>
    )
  }

  return (
    <Box>
      <RichEditor initialValue={rulesParsed} onClose={() => setMode('view')} />
    </Box>
  )
}
