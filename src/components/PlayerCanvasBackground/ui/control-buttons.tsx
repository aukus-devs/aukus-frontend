import React from 'react'
import { Button, Divider } from '@mui/material'
import { useSnackbar } from 'notistack'
import isEqual from 'lodash/isEqual'
import { CanvasImage, usePlayerCanvasBackgroundContext } from '../context'
import { useSaveCanvasImages, useUploadCanvasImage } from '../queries'
import { Color } from '../../../utils/types'

export function ControlButtons({
  imageList,
  setImageList,
}: {
  imageList: CanvasImage[]
  setImageList: React.Dispatch<React.SetStateAction<CanvasImage[]>>
}) {
  const { enqueueSnackbar } = useSnackbar()

  const {
    selectedImage,
    setSelectedImage,
    setIsEditMode,
    player,
    images,
    flipFunction,
    setFlipFunction,
  } = usePlayerCanvasBackgroundContext()

  const saveMutation = useSaveCanvasImages(player.id)

  const uploadMutation = useUploadCanvasImage(player.id)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (!file) return

    if (file.size > 1024 * 1024 * 5) {
      enqueueSnackbar('Файл больше 5MB', {
        variant: 'error',
        autoHideDuration: 6000,
      })
      return
    }

    const image = new window.Image()
    image.onload = () => {
      uploadMutation.mutate(
        {
          file: file,
          width: image.width,
          height: image.height,
        },
        {
          // onSuccess: () => {
          //   console.log('Image uploaded')
          //   enqueueSnackbar('Изображение загружено', {
          //     variant: 'success',
          //     autoHideDuration: 3000,
          //   })
          // },
          onError: (error) => {
            console.error('Failed to upload image')
            console.error(error)

            enqueueSnackbar('Не удалось загрузить изображение', {
              variant: 'error',
              autoHideDuration: 6000,
            })
          },
          onSettled: () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          },
        }
      )
    }
    image.src = URL.createObjectURL(file)
  }

  const onUploadClick = () => fileInputRef.current?.click()

  const handleImageDelete = () => {
    if (!selectedImage) return

    setSelectedImage(null)
    setFlipFunction(null)

    const newList = imageList.filter((i) => i.id !== selectedImage.id)
    setImageList(newList)
  }

  const save = (newList?: CanvasImage[], exitEditMode = true) => {
    const list = (newList || imageList).map((el, i) => ({
      ...el,
      zIndex: i,
    }))

    saveMutation.mutate(list, {
      onSuccess: () => {
        console.log('Saved')
        // enqueueSnackbar(newList ? 'Изображение удалено' : 'Сохранено', {
        //   variant: 'success',
        //   autoHideDuration: 3000,
        // })
        if (exitEditMode) {
          setIsEditMode(false)
        }
      },
      onError: (error) => {
        console.error('Failed to save images')
        console.error(error)
        enqueueSnackbar(
          newList
            ? 'Произошла ошибка при удалении'
            : 'Произошла ошибка при сохранении',
          {
            variant: 'error',
            autoHideDuration: 6000,
          }
        )
      },
    })
  }

  const handleSave = () => {
    setSelectedImage(null)
    setFlipFunction(null)
    save()
  }

  const handleChangeEditMode = () => {
    let disableEditMode = true
    if (!isEqual(images, imageList)) {
      disableEditMode = window.confirm('Вы забыли сохранить изменения')
    }
    setIsEditMode(!disableEditMode)
    setSelectedImage(null)
    setFlipFunction(null)
  }

  return (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={handleChangeEditMode}
        sx={{ width: '150px' }}
      >
        Отмена
      </Button>

      <Button
        variant="contained"
        disabled={!flipFunction}
        onClick={() => flipFunction?.()}
        color="customBrown"
        sx={{ width: '150px' }}
      >
        Отразить
      </Button>
      <Button
        variant="contained"
        color="customRed"
        onClick={handleImageDelete}
        disabled={!selectedImage}
        sx={{ width: '150px' }}
      >
        Удалить
      </Button>

      <Button
        variant="contained"
        color="customBlue"
        onClick={handleSave}
        sx={{ width: '150px' }}
      >
        Сохранить
      </Button>

      <Divider
        orientation="vertical"
        color={Color.greyLight}
        flexItem
        sx={{
          borderRadius: 10,
          borderRightWidth: 4,
          marginY: '7px',
        }}
      />

      <input
        ref={fileInputRef}
        accept=".jpg, .jpeg, .png, .gif, .webp, .svg"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button
        variant="contained"
        color="customGreen"
        onClick={onUploadClick}
        sx={{ width: '200px' }}
      >
        {uploadMutation.isPending ? 'Загрузка...' : 'Загрузить фото'}
      </Button>
    </>
  )
}
