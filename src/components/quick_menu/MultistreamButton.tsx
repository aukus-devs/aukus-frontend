import { Button, Link } from '@mui/material'
import VideoIcon from 'assets/icons/video.svg?react'

export default function MultistreamButton() {
  return (
    <Link
      href={'https://veksever.ru/twitch_live/aucus3'}
      target={'_blank'}
      rel="noopener nereferrer"
    >
      <Button>
        <VideoIcon style={{ marginRight: '8px' }} />
        Мультитрансляция
      </Button>
    </Link>
  )
}
