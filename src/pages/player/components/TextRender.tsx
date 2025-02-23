import { Link } from '@mui/material'
import { Fragment } from 'react/jsx-runtime'
import LinkSpan from 'src/components/common/LinkSpan'

type Props = {
  text: string
  borderColor: string
}

export default function TextRender(props: Props) {
  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Split by new lines and process each line
  const items = props.text.split('\n').map((line: string) => {
    // Split by URLs within the line
    const parts = line.split(urlRegex)
    return parts.map((part) => {
      // If part matches the URL regex, render it as a link
      if (urlRegex.test(part)) {
        return (
          <Link href={part} target="_blank" rel="noopener noreferrer">
            <LinkSpan color={props.borderColor}>{part}</LinkSpan>
          </Link>
        )
      }
      // Otherwise, render it as text
      return <span>{part}</span>
    })
  })

  return (
    <Fragment>
      {items.map((item, index) => {
        return (
          <Fragment key={index}>
            {item}
            <br />
          </Fragment>
        )
      })}
    </Fragment>
  )
}
