import React, { SVGProps, useEffect, useRef, useState } from 'react'
import { Box, Button } from '@mui/material'
import {
  CanvasImage,
  PlayerCanvasBackgroundContextProvider,
  usePlayerCanvasBackgroundContext,
} from './context'
import { useRefDimensions } from './use-ref-dimensions'
import { ControlButtons } from './ui/control-buttons'
import { CanvasStage } from './ui/canvas-stage'
import { Player } from 'utils/types'
import { StaticCanvas } from './ui/static-canvas'
import MainMenu from 'components/MainMenu'
import PointAucModal from 'pages/player/components/PointAucModal'
import { useMutation } from '@tanstack/react-query'
import { resetPointaucToken } from 'utils/api'
import AddSquareIcon from 'assets/add-square.svg?react'

function ImageSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24.4651 1.16666H21.0351C20.0201 1.16666 19.2734 1.58666 18.9351 2.33332C18.7484 2.67166 18.6667 3.06832 18.6667 3.53499V6.96499C18.6667 8.44666 19.5534 9.33332 21.0351 9.33332H24.4651C24.9317 9.33332 25.3284 9.25166 25.6667 9.06499C26.4134 8.72666 26.8334 7.97999 26.8334 6.96499V3.53499C26.8334 2.05332 25.9467 1.16666 24.4651 1.16666ZM25.5617 5.75166C25.4451 5.86832 25.2701 5.94999 25.0834 5.96166H23.4384V6.55666L23.4501 7.58332C23.4384 7.78166 23.3684 7.94499 23.2284 8.08499C23.1117 8.20166 22.9367 8.28332 22.7501 8.28332C22.3651 8.28332 22.0501 7.96832 22.0501 7.58332V5.94999L20.4167 5.96166C20.0317 5.96166 19.7167 5.63499 19.7167 5.24999C19.7167 4.86499 20.0317 4.54999 20.4167 4.54999L21.4434 4.56166H22.0501V2.92832C22.0501 2.54332 22.3651 2.21666 22.7501 2.21666C23.1351 2.21666 23.4501 2.54332 23.4501 2.92832L23.4384 3.75666V4.54999H25.0834C25.4684 4.54999 25.7834 4.86499 25.7834 5.24999C25.7717 5.44832 25.6901 5.61166 25.5617 5.75166Z"
        fill="white"
      />
      <path
        d="M10.5003 12.11C12.0338 12.11 13.277 10.8668 13.277 9.33331C13.277 7.7998 12.0338 6.55664 10.5003 6.55664C8.96679 6.55664 7.72363 7.7998 7.72363 9.33331C7.72363 10.8668 8.96679 12.11 10.5003 12.11Z"
        fill="white"
      />
      <path
        d="M24.4649 9.33334H23.9166V14.7117L23.7649 14.5833C22.8549 13.8017 21.3849 13.8017 20.4749 14.5833L15.6216 18.7483C14.7116 19.53 13.2416 19.53 12.3316 18.7483L11.9349 18.4217C11.1066 17.6983 9.78825 17.6283 8.85492 18.2583L4.49159 21.1867C4.23492 20.5333 4.08325 19.775 4.08325 18.8883V9.11168C4.08325 5.82168 5.82159 4.08334 9.11159 4.08334H18.6666V3.53501C18.6666 3.06834 18.7483 2.67168 18.9349 2.33334H9.11159C4.86492 2.33334 2.33325 4.86501 2.33325 9.11168V18.8883C2.33325 20.16 2.55492 21.2683 2.98659 22.2017C3.98992 24.4183 6.13659 25.6667 9.11159 25.6667H18.8883C23.1349 25.6667 25.6666 23.135 25.6666 18.8883V9.06501C25.3283 9.25168 24.9316 9.33334 24.4649 9.33334Z"
        fill="white"
      />
    </svg>
  )
}

export function EditModeButton() {
  const { setIsEditMode } = usePlayerCanvasBackgroundContext()

  return (
    <Button
      sx={{
        width: '215px',
        height: '40px',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
      color="customBlue"
      onClick={() => setIsEditMode(true)}
    >
      <ImageSvg width="19px" height="19px" />
      <Box marginLeft={'8px'} />
      Изменить страницу
    </Button>
  )
}

function PointAucButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      sx={{
        width: '220px',
        height: '40px',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
      color="customBlue"
      onClick={onClick}
    >
      <AddSquareIcon />
      <Box marginLeft={'8px'} />
      Привязать PointAuc
    </Button>
  )
}

type CanvasContainerProps = {
  width: number
  height: number
  canEdit?: boolean
  isOwner?: boolean
}

function CanvasContainer({ canEdit, isOwner, ...props }: CanvasContainerProps) {
  const { images, isEditMode } = usePlayerCanvasBackgroundContext()
  const [imageList, setImageList] = useState<CanvasImage[]>(images)

  const [showPointAucModal, setShowPointAucModal] = useState(false)
  const resetToken = useMutation({ mutationFn: resetPointaucToken })

  const handleConnectPointAuc = async () => {
    setShowPointAucModal(false)
    const { token } = await resetToken.mutateAsync()
    const url = `https://pointauc.com/aukus/redirect?aukus_token=${token}`
    window.open(url, '_blank')
  }

  const handlePointAucClick = () => {
    setShowPointAucModal(true)
  }

  useEffect(() => {
    if (isEditMode) {
      setImageList((currentList) =>
        images.map((img) => {
          const localImg = currentList.find((i) => i.id === img.id)
          if (localImg) {
            return localImg
          }
          return img
        })
      )
    } else {
      setImageList(images)
    }
  }, [images, isEditMode])

  let editButton = null
  if (!isEditMode && canEdit) {
    editButton = <EditModeButton />
  }

  let pointAucButton = null
  if (!isEditMode && isOwner) {
    pointAucButton = <PointAucButton onClick={handlePointAucClick} />
  }

  const controlButtons = isEditMode && (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <ControlButtons imageList={imageList} setImageList={setImageList} />
    </Box>
  )

  return (
    <>
      <MainMenu currentPage="player" replaceMenuButtons={controlButtons} />
      {isEditMode ? (
        <CanvasStage
          {...props}
          imageList={imageList}
          setImageList={setImageList}
        />
      ) : (
        <StaticCanvas />
      )}
      <PointAucModal
        open={showPointAucModal}
        onClose={() => setShowPointAucModal(false)}
        onAccept={handleConnectPointAuc}
      />
    </>
  )
}

type Props = {
  player: Player
  children: React.ReactNode
  canEdit?: boolean
  isOwner?: boolean
}

export function PlayerCanvasBackground({
  children,
  player,
  canEdit,
  isOwner,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useRefDimensions(containerRef)

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        zIndex: 0,
        height: '100%',
      }}
    >
      <PlayerCanvasBackgroundContextProvider player={player}>
        <CanvasContainer {...dimensions} canEdit={canEdit} isOwner={isOwner} />
      </PlayerCanvasBackgroundContextProvider>

      {children}
    </Box>
  )
}
