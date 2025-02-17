import { Box, Button } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchRules, updateRules } from 'src/utils/api'
import { useState } from 'react'
import { RichDisplay, RichEditor } from './RichText'

export default function PlayerRules() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [editedRules, setEditedRules] = useState<string | null>(null)

  const { mutate: saveRules } = useMutation({
    mutationFn: updateRules,
  })

  const { data: rulesData, refetch: refetchRules } = useQuery({
    queryKey: ['playerRules'],
    queryFn: fetchRules,
    enabled: mode === 'view',
    refetchInterval: 60 * 1000,
  })

  const rules =
    rulesData?.rules_data ||
    JSON.stringify({ ops: [{ insert: 'Загрузка...' }] })

  // console.log('rules', rules)

  const handleCloseAndSave = () => {
    setMode('view')
    if (editedRules) {
      saveRules(editedRules, { onSuccess: () => refetchRules() })
    }
  }

  const handleTextChange = (value: string) => {
    setEditedRules(value)
  }

  return (
    <Box>
      {mode === 'view' ? (
        <Box>
          <Button
            onClick={() => setMode('edit')}
            style={{ marginBottom: '10px' }}
          >
            Редактировать
          </Button>
          {/* <RichDisplay value={rules} /> */}
          <RichDisplay value={rules} />
        </Box>
      ) : (
        <Box>
          <Box marginBottom="10px">
            <Button
              onClick={handleCloseAndSave}
              style={{ marginRight: '10px' }}
            >
              Сохранить
            </Button>
            <Button onClick={() => setMode('view')}>Отменить</Button>
          </Box>
          <RichEditor initialValue={rules} onTextChange={handleTextChange} />
        </Box>
      )}
    </Box>
  )
}
