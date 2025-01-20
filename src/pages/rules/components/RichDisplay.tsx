import { Box } from '@mui/material'
import { SlateElement, SlateText } from 'src/types/slate'
import { Color } from 'src/utils/types'

type Props = {
  data: SlateElement[]
}

export default function RichDisplay({ data }: Props) {
  return (
    <Box style={{ border: '1px solid white', width: '720px', padding: '20px' }}>
      <RichChildren items={data} />
    </Box>
  )
}

function RichChildren({ items }: { items: (SlateElement | SlateText)[] }) {
  return (
    <>
      {items.map((item: SlateElement | SlateText, index: number) => {
        if ('text' in item) {
          return <RichElementText key={index} item={item} />
        }
        return <RichElement key={index} element={item} />
      })}
    </>
  )
}

function RichElement({ element }: { element: SlateElement }) {
  const textAlign = element.align ?? 'left'
  const textStyle = {
    lineHeight: '1.2',
    marginTop: '0.8em',
    marginBottom: '0.8em',
  }
  switch (element.type) {
    case 'paragraph':
      return (
        <p style={{ textAlign, ...textStyle }}>
          <RichChildren items={element.children} />
        </p>
      )
    case 'heading-one':
      return (
        <h1 style={{ textAlign, ...textStyle }}>
          <RichChildren items={element.children} />
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={{ textAlign, ...textStyle }}>
          <RichChildren items={element.children} />
        </h2>
      )
    case 'heading-three':
      return (
        <h3 style={{ textAlign, ...textStyle }}>
          <RichChildren items={element.children} />
        </h3>
      )
    case 'bulleted-list':
      return (
        <ul style={{ textAlign }}>
          <RichChildren items={element.children} />
        </ul>
      )
    case 'numbered-list':
      return (
        <ol style={{ textAlign }}>
          <RichChildren items={element.children} />
        </ol>
      )
    case 'list-item':
      return (
        <li style={{ textAlign }}>
          <RichChildren items={element.children} />
        </li>
      )
    case 'block-quote':
      return (
        <blockquote style={{ textAlign }}>
          <RichChildren items={element.children} />
        </blockquote>
      )
    case 'link':
      return (
        <a
          href={element.url}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            color: Color.blueLight,
            textDecoration: 'underline',
            textDecorationColor: Color.blueLight,
          }}
        >
          <RichChildren items={element.children} />
        </a>
      )
  }
}

function RichElementText({ item }: { item: SlateText }) {
  const style: React.CSSProperties = { fontWeight: '400' }
  if (item.bold) {
    style.fontWeight = '700'
  }
  if (item.italic) {
    style.fontStyle = 'italic'
  }
  if (item.underline) {
    style.textDecoration = 'underline'
  }
  return <span style={style}>{item.text}</span>
}
