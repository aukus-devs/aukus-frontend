import { Button, ButtonProps } from '@mui/material'

type Props = {
  toggled: boolean
} & ButtonProps

export default function ToggleButton({ toggled, ...props }: Props) {
  const backgroundColor = toggled ? 'primary.dark' : 'primary.main'

  return (
    <Button {...props} sx={{ backgroundColor }}>
      {props.children}
    </Button>
  )
}
