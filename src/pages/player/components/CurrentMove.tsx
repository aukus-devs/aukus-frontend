import { Box } from '@mui/material'
import LinkSpan from 'src/components/LinkSpan'
import { formatDate, formatSecondsToTime } from './utils'
import { useState } from 'react'
import EditCurrentGameModal from './EditCurrentGameModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCurrentGame } from 'src/utils/api'
import { getPlayerColor, Player } from 'src/utils/types'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'

type CurrentMoveProps = {
  id: number
  title: string
  player: Player
  updatedAt: string
  canEdit: boolean
}

export default function CurrentMove({
  id,
  title,
  player,
  updatedAt,
  canEdit,
}: CurrentMoveProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const queryClient = useQueryClient()
  const updateTitle = useMutation({ mutationFn: updateCurrentGame })

  const handleSave = async (title: string) => {
    updateTitle.mutate(
      { player_id: player.id, title },
      {
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['players'] })
        },
      }
    )
    setModalOpen(false)
  }

  let gameImage = player.current_game_image
  if (gameImage) {
    gameImage = gameImage.replace('{width}', '200').replace('{height}', '300')
  }

  let durationText = null
  if (player.current_game_duration) {
    durationText = formatSecondsToTime(player.current_game_duration)
    durationText = `Играет ${durationText}`
  }

  const playerColor = getPlayerColor(player.url_handle)

  return (
    <>
      <Box display={'flex'} justifyContent={'center'} marginBottom={'50px'}>
        <Box
          marginLeft={'10px'}
          marginRight={'10px'}
          borderRadius={'15px'}
          border={`2px solid ${playerColor}`}
          width={'800px'}
          textAlign={'left'}
          padding={'15px'}
          lineHeight={1}
          style={{
            backgroundColor: playerColor,
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            fontSize={'14px'}
            fontWeight={400}
            marginBottom={'15px'}
          >
            <Box>Ход — {id}</Box>
            <Box>{formatDate(updatedAt)}</Box>
          </Box>
          <Box
            fontSize={'14px'}
            style={{ backgroundColor: 'white', color: 'black' }}
            width={'fit-content'}
            paddingTop={'5px'}
            paddingBottom={'5px'}
            paddingLeft={'12px'}
            paddingRight={'12px'}
            borderRadius={'5px'}
            marginBottom={'15px'}
          >
            Выпало на ауке
          </Box>
          <Box display={'flex'}>
            <Box marginRight={'10px'}>
              {gameImage ? (
                <img
                  src={gameImage}
                  alt="game"
                  style={{
                    borderRadius: '5px',
                    width: '80px',
                    height: '120px',
                  }}
                />
              ) : (
                <ImagePlaceholder
                  style={{
                    borderRadius: '5px',
                    width: '80px',
                    height: '120px',
                  }}
                />
              )}
            </Box>
            <Box>
              <Box fontSize={'24px'}>{title}</Box>
              {durationText && <Box marginTop={'10px'}>{durationText}</Box>}
            </Box>
          </Box>
          {canEdit && (
            <Box fontWeight={400} textAlign={'end'}>
              <LinkSpan onClick={() => setModalOpen(true)}>
                Редактировать
              </LinkSpan>
            </Box>
          )}
        </Box>
      </Box>
      <EditCurrentGameModal
        open={modalOpen}
        title={title}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
