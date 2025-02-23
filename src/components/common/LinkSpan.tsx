import { styled } from '@mui/system'

interface LinkSpanProps {
  color?: string
  active?: boolean
  defaultColor?: string
  hideUnderline?: boolean
  underlineColor?: string
  underlineSize?: string
}

const LinkSpan = styled('span', {
  shouldForwardProp: (prop) =>
    prop !== 'active' &&
    prop !== 'defaultColor' &&
    prop !== 'hideUnderline' &&
    prop !== 'underlineSize' &&
    prop !== 'underlineColor', // This prevents the `active` prop from being passed to the DOM element
})<LinkSpanProps>(({
  color,
  active,
  defaultColor = 'white',
  hideUnderline,
  underlineColor,
  underlineSize,
}: LinkSpanProps) => {
  const borderSize = underlineSize || '2px'
  return {
    borderBottom: hideUnderline
      ? '0'
      : `${borderSize} solid ${underlineColor || color || defaultColor}`,
    color: active ? color : defaultColor,
    ':hover': {
      color: color || defaultColor,
      cursor: 'pointer',
      borderBottom: hideUnderline
        ? '0'
        : `${borderSize} solid ${color || defaultColor}`,
    },
  }
})

export default LinkSpan
