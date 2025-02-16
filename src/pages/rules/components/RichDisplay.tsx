import { Box } from '@mui/material'
import Quill, { Delta } from 'quill'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SlateElement, SlateText } from 'src/types/slate'
import { Color } from 'src/utils/types'

type Props = {
  value?: string
}

export default function RichDisplay({ value }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const [htmlContent, setHtmlContent] = useState<string>('empty')

  useEffect(() => {
    if (containerRef.current) {
      const parsedVal = value ? JSON.parse(value) : { ops: [] }
      const delta = new Delta(parsedVal)

      if (!quillRef.current) {
        const quill = new Quill(containerRef.current, {
          theme: 'snow', // Use any theme
          readOnly: true, // Make it read-only
        })
        // Load the Delta into the editor
        quill.setContents(delta)
        quillRef.current = quill
      }

      quillRef.current.setContents(delta)
      const html = quillRef.current.root.innerHTML
      const fixNewlines = html.replaceAll('\\n', '<br />')
      console.log('fixNewlines', fixNewlines)
      setHtmlContent(fixNewlines)
    }
  }, [value])

  console.log('htmlContent', htmlContent)

  return (
    <Box
      style={{
        width: '800px',
        backgroundColor: Color.greyDark,
        borderRadius: '15px',
        padding: '10px',
        paddingTop: '1px',
      }}
    >
      <Box display="none">
        <Box ref={containerRef} />
      </Box>
      <Box
        whiteSpace="pre-line"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
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
  if (item.text === '') {
    style.display = 'block'
    style.height = '1em'
  }
  return <span style={style}>{item.text}</span>
}
