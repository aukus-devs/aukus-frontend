import { Button, ButtonProps } from '@mui/material'

type Props = {
  toggled: boolean
} & ButtonProps

export default function ToggleButton({ toggled, ...props }: Props) {
  const color = props.color ? props.color : 'primary'
  const backgroundColor = toggled ? `${color}.dark` : `${color}.main`
  const sx = props.sx || {}
  return (
    <Button {...props} sx={{ ...sx, backgroundColor }}>
      {props.children}
    </Button>
  )
}
