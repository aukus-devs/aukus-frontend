import { Box, Button, IconButton, SelectChangeEvent } from '@mui/material'
import { Color, ItemLength, MoveType, Player } from 'src/utils/types'
import { useCallback, useEffect, useState } from 'react'
import useLocalStorage from 'src/context/useLocalStorage'
import { checkImageValid } from '../utils'
import { useQuery } from '@tanstack/react-query'
import { fetchGameNames } from 'src/utils/api'
import debounce from 'lodash/debounce'
import TurnForm from './GameReviewForm'
import { Close } from '@mui/icons-material'
import FormControl from './FormControl'

type Props = {
  player: Player
  onClose: () => void
}

export default function BottomPanel({ player, onClose }: Props) {
  return (
    <Box
      position="fixed"
      bottom="0px"
      left="0px"
      width="100%"
      display="flex"
      justifyContent="center"
      zIndex="50"
      // zIndex="5000"
      sx={{ pointerEvents: 'none' }}
    >
      <Box
        // width="700px"
        // height="350px"
        // border="1px solid white"
        sx={{
          backgroundColor: Color.greyDark,
          // zIndex: 5000,
          pointerEvents: 'auto',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <FormControl
          player={player}
          onClose={onClose}
          onTurnFinished={() => onClose()}
        />
      </Box>
    </Box>
  )
}
