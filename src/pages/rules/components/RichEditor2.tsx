import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Quill, { Delta, QuillOptions } from 'quill'

import 'quill/dist/quill.snow.css'
import { Box } from '@mui/material'
import { Color } from 'src/utils/types'

type Props = {
  readOnly?: boolean
  initialValue?: string
  onTextChange?: (data: string) => void
}

export default function RichEditor({
  readOnly,
  onTextChange,
  initialValue,
}: Props) {
  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null)

  const handleTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
    // console.log('Text change:', delta, oldDelta, source)
    const content = quillRef.current?.getContents()
    console.log('Content:', JSON.stringify(content))
    onTextChange?.(JSON.stringify(content))
  }

  const initialDecoded = initialValue
    ? new Delta(JSON.parse(initialValue))
    : new Delta().insert('No content added yet')

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
        defaultValue={initialDecoded}
        onTextChange={handleTextChange}
      />
    </Box>
  )
}

// Define the types for the props
type EditorProps = {
  readOnly?: boolean
  defaultValue?: Delta // You can replace `any` with a more specific type if you know the structure of the default value
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

      const params: QuillOptions = {
        theme: 'snow',
      }
      if (readOnly) {
        params['readOnly'] = true
        params['modules'] = {
          toolbar: false,
        }
      }

      const quill = new Quill(editorContainer, params)

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
      <Box ref={containerRef} style={{ width: '700px', height: '700px' }} />
    )
  }
)

Editor.displayName = 'Editor'
