import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Quill, { Delta } from 'quill'

import 'quill/dist/quill.snow.css'
import { Box } from '@mui/material'
import { Color } from 'src/utils/types'

// Define types for the range and lastChange state
type Range = { index: number; length: number } | null
type LastChange = { ops: any[] } | null // Replace `any` with a more specific type if you know the structure of `ops`

export default function RichEditor() {
  const [range, setRange] = useState<Range>()
  const [lastChange, setLastChange] = useState<LastChange>()
  const [readOnly, setReadOnly] = useState<boolean>(false)

  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null)

  const handleTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
    console.log('Text change:', delta, oldDelta, source)
    const content = quillRef.current?.getContents()
    console.log('Content:', JSON.stringify(content))
  }

  return (
    <Box
      style={{
        backgroundColor: Color.greyDark,
      }}
      className="rich-editor"
    >
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={new Delta()
          .insert('Hello')
          .insert('\n', { header: 1 })
          .insert('Some ')
          .insert('initial', { bold: true })
          .insert(' ')
          .insert('content', { underline: true })
          .insert('\n')}
        onSelectionChange={setRange}
        onTextChange={handleTextChange}
      />
      <div
        className="controls"
        style={{
          display: 'none',
          border: '1px solid #ccc',
          borderTop: 'none',
          padding: '10px',
        }}
      >
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          className="controls-right"
          style={{ marginLeft: 'auto' }}
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength())
          }}
        >
          Get Content Length
        </button>
      </div>
      <Box display="none">
        <div
          style={{
            margin: '10px 0',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              color: '#999',
              textTransform: 'uppercase',
            }}
          >
            Current Range:
          </div>
          {range ? JSON.stringify(range) : 'Empty'}
        </div>
        <div
          style={{
            margin: '10px 0',
            fontFamily: 'monospace',
          }}
        >
          <div className="state-title">Last Change:</div>
          {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
        </div>
      </Box>
    </Box>
  )
}

// Define the types for the props
type EditorProps = {
  readOnly?: boolean
  defaultValue?: any // You can replace `any` with a more specific type if you know the structure of the default value
  onTextChange?: (...args: any[]) => void
  onSelectionChange?: (...args: any[]) => void
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const onTextChangeRef = useRef(onTextChange)
    const onSelectionChangeRef = useRef(onSelectionChange)

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onSelectionChangeRef.current = onSelectionChange
    })

    useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.enable(!readOnly)
      }
    }, [ref, readOnly])

    useEffect(() => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      )
      const quill = new Quill(editorContainer, {
        theme: 'snow',
      })

      if (ref && typeof ref === 'object') {
        ref.current = quill
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current)
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args)
      })

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args)
      })

      return () => {
        if (ref && typeof ref === 'object') {
          ref.current = null
        }
        container.innerHTML = ''
      }
    }, [ref])

    return (
      <div ref={containerRef} style={{ width: '700px', height: '700px' }}></div>
    )
  }
)

Editor.displayName = 'Editor'
