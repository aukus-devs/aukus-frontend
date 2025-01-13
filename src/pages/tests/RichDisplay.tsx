import { SlateElement, SlateText } from 'src/types/slate'

type Props = {
  data: SlateElement[]
}

export default function RichDisplay({ data }: Props) {
  return (
    <div>
      {data.map((element, index) => {
        return <RichElement key={index} element={element} />
      })}
    </div>
  )
}

function RichElement({ element }: { element: SlateElement }) {
  const textAlign = element.align ?? 'left'
  switch (element.type) {
    case 'paragraph':
      return (
        <p style={{ textAlign }}>
          <RichElementText items={element.children} />
        </p>
      )
    case 'heading-one':
      return (
        <h1 style={{ textAlign }}>
          <RichElementText items={element.children} />
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={{ textAlign }}>
          <RichElementText items={element.children} />
        </h2>
      )
    case 'bulleted-list':
      return (
        <ul style={{ textAlign }}>
          <RichElementText items={element.children} />
        </ul>
      )
    case 'numbered-list':
      return (
        <ol style={{ textAlign }}>
          <RichElementText items={element.children} />
        </ol>
      )
    case 'list-item':
      return (
        <li style={{ textAlign }}>
          <RichElementText items={element.children} />
        </li>
      )
    case 'block-quote':
      return (
        <blockquote style={{ textAlign }}>
          <RichElementText items={element.children} />
        </blockquote>
      )

    default:
      return (
        <p style={{ color: 'red' }}>
          Unsupported: {element.type}:{' '}
          <RichElementText items={element.children} />
        </p>
      )
  }
}

function RichElementText({ items }: { items: SlateText[] }) {
  return (
    <>
      {items.map((item: SlateText, index: number) => {
        return <span key={index}>{item.text}</span>
      })}
    </>
  )
}
