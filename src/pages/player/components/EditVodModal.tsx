import { Close } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, useEffect, useState } from 'react'
import ImagePlaceholder from 'assets/icons/image_placeholder.svg?react'
import { fetchGameNames } from 'src/utils/api'
import { CustomPopper } from 'src/pages/map/components/action/TurnModal'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  onSave: (text: string, title: string) => void
  vodText: string | null
}

export default function EditVodModal({
  open,
  title,
  onClose,
  onSave,
  vodText,
}: Props) {
  const [vodValue, setVodValue] = useState(vodText)
  const [itemTitle, setItemTitle] = useState(title)

  const {
    data: gameNamesData,
    dataUpdatedAt: updateTs,
    refetch,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ['game_names_edit_vod'],
    queryFn: () => fetchGameNames(itemTitle),
    enabled: itemTitle.length > 3,
  })

  useEffect(() => {
    if (
      status !== 'pending' &&
      fetchStatus === 'idle' &&
      itemTitle.length > 3 &&
      updateTs + 500 < Date.now()
    ) {
      refetch()
    }
  }, [itemTitle, updateTs, refetch, fetchStatus, open])

  let titleOptions: string[] = []
  let imageUrl: string | null = null

  if (itemTitle.length > 3 && gameNamesData && gameNamesData.games.length > 0) {
    titleOptions = gameNamesData.games.map((game) => game.gameName)

    const matchingUrl =
      gameNamesData.games.find((game) => game.gameName === itemTitle)
        ?.box_art_url || gameNamesData.games[0].box_art_url
    if (fetchStatus === 'idle') {
      imageUrl = matchingUrl
        .replace('{width}', '200')
        .replace('{height}', '300')
    }
  }

  const handleVodChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVodValue(e.target.value)
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle
        fontSize={'24px'}
        fontWeight={600}
        style={{
          paddingTop: '30px',
          paddingLeft: '30px',
          lineHeight: '1',
          paddingBottom: '30px',
          paddingRight: '30px',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          Записи для {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              padding: 0,
              color: 'white',
            }}
          >
            <Close sx={{ fontSize: '29px' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '50px',
        }}
      >
        <Box display="flex">
          <Box marginRight={'10px'}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="game"
                style={{
                  width: '120px',
                  height: '180px',
                  borderRadius: '10px',
                }}
              />
            ) : (
              <ImagePlaceholder
                width={'120px'}
                height={'180px'}
                style={{ borderRadius: '10px' }}
              />
            )}
          </Box>
          <Box>
            <Box marginBottom="10px">Обновить название игры</Box>
            <Autocomplete
              freeSolo
              fullWidth
              PopperComponent={CustomPopper}
              options={titleOptions}
              value={itemTitle}
              onChange={(_, newValue) => {
                setItemTitle(newValue || '')
              }}
              renderInput={(params) => (
                <TextField
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setItemTitle(event.target.value)}
                  {...params}
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontSize: '16px important!',
                  }}
                />
              )}
              sx={{
                width: '420px',
              }}
              className={titleOptions.length > 0 ? 'has-options' : 'no-options'}
            />
          </Box>
        </Box>
        <Box marginTop={'20px'} marginBottom="10px">
          Обновить ссылки на записи стримов
        </Box>
        <TextField
          InputProps={{
            style: {
              paddingTop: '10px',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingBottom: '10px',
              lineHeight: '1.2',
              fontSize: '16px',
              fontWeight: 500,
            },
          }}
          multiline
          fullWidth
          rows={6}
          value={vodValue}
          onChange={handleVodChange}
        />
      </DialogContent>
      <DialogActions
        style={{
          paddingTop: 0,
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onSave(vodValue || '', itemTitle || '')}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
