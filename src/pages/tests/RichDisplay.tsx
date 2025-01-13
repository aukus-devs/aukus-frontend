import { SlateElement } from 'src/utils/declaration'

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
      return <p style={{ textAlign }}>{element.children}</p>
    case 'heading-one':
      return <h1 style={{ textAlign }}>{element.children}</h1>
    case 'heading-two':
      return <h2 style={{ textAlign }}>{element.children}</h2>
    case 'bulleted-list':
      return <ul style={{ textAlign }}>{element.children}</ul>
    case 'numbered-list':
      return <ol style={{ textAlign }}>{element.children}</ol>
    case 'list-item':
      return <li style={{ textAlign }}>{element.children}</li>
    case 'block-quote':
      return <blockquote style={{ textAlign }}>{element.children}</blockquote>

    default:
      return (
        <p style={{ color: 'red' }}>
          Unsupported: {element.type}: {element.children}
        </p>
      )
  }
}
