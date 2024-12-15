import { Box } from '@mui/material'
import StarImage from 'assets/big_star.svg?react'

export default function Opening() {
  return (
    <Box paddingTop={'250px'} position="relative">
      <Box position="absolute" top="-50px" left="-30px" zIndex={0}>
        <StarImage />
      </Box>
      <Box
        fontWeight={700}
        fontSize="64px"
        fontFamily="MursGothicMassive"
        zIndex="10"
        position="relative"
      >
        Итоги ивента АУКУС
      </Box>
      <Box
        fontSize="24px"
        fontFamily="MursGothicWide"
        textAlign="center"
        position="relative"
        zIndex="10"
      >
        2024
      </Box>
    </Box>
  )
}
