import { Box } from '@mui/material'
import { getPlayerColor, Player } from 'src/utils/types'
import FlashIcon from 'assets/icons/flash.svg?react'

type Props = {
  player: Player
  place: number
}

export default function PlayerPresentation({ player, place }: Props) {
  const playerColor = getPlayerColor(player.url_handle)
  return (
    <Box textAlign="center" marginTop="150px" lineHeight="1.2">
      <Box fontSize="24px" color={playerColor}>
        {place}-ое место
      </Box>
      <Box fontSize="64px" fontWeight={800} marginTop="20px">
        {player.first_name} «{player.name}»
      </Box>
      <Box
        fontSize="24px"
        marginTop="30px"
        fontWeight="1000"
        textTransform="uppercase"
        fontStyle="italic"
        color={playerColor}
      >
        Какое-то звание
      </Box>
      <Box marginTop="200px" fontSize="40px" color={playerColor}>
        Премия в номинации: Тест года
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <Box
          style={{ backgroundColor: playerColor }}
          width="900px"
          height="470px"
        ></Box>
      </Box>
      <Box marginTop="30px" fontSize="24px">
        Победил больше всего драконов
      </Box>
      <Box
        marginTop="200px"
        fontSize="40px"
        color={playerColor}
        display="flex"
        justifyContent="center"
      >
        <FlashIcon
          style={{
            alignSelf: 'center',
            width: '48px',
            height: '48px',
            marginRight: '10px',
          }}
        />
        Топовый клип за ивент
      </Box>
      <Box display="flex" justifyContent="center" marginTop="50px">
        <Box
          style={{ backgroundColor: playerColor }}
          width="900px"
          height="470px"
          marginBottom="300px"
        ></Box>
      </Box>
    </Box>
  )
}
