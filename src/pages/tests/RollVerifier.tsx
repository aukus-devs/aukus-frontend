import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import { rollsFromSeed } from './TimedButton'

export default function RollVerifier() {
  const [seed, setSeed] = useState<string>('')

  const values = rollsFromSeed(seed, '3d6')

  return (
    <Box>
      <TextField
        label="Seed"
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
      />
      <Box>
        {values.map((value, i) => (
          <Box key={i}>{value}</Box>
        ))}
      </Box>
    </Box>
  )
}
