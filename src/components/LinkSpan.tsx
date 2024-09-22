import { styled } from '@mui/system'

const LinkSpan = styled('span')(({ color }) => ({
  borderBottom: `2px solid ${color}`,
  ':hover': {
    color: color,
  },
}))

export default LinkSpan