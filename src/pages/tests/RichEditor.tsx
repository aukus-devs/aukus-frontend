import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  Link as LinkIcon,
  LooksOne,
  LooksTwo,
} from '@mui/icons-material'
import { Box, Button, ButtonProps, TextField } from '@mui/material'
import { useCallback, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { Color } from 'utils/types'

import { createEditor, Element as ElementClass } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react'
import {
  SlateBlockFormat,
  SlateElement,
  SlateText,
  SlateTextFormat,
} from 'src/utils/declaration'

const initialValue: SlateElement[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'жирный', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export function RichEditor() {
  const [editor] = useState(() => withReact(createEditor()))
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const isLinkActive = isMarkActive(editor, 'link')

  const handleChange = (value: SlateElement[]) => {
    const isAstChange = editor.operations.some(
      (op) => 'set_selection' !== op.type
    )
    if (isAstChange) {
      // Save the value to Local Storage.
      const content = JSON.stringify(value)
      localStorage.setItem('content', content)
      console.log(content)
    }
  }

  return (
    <Box width="700px" height="550px" border="0px solid white">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        <Toolbar>
          <MarkButton format="bold" icon={FormatBold} />
          <MarkButton format="italic" icon={FormatItalic} />
          <MarkButton format="underline" icon={FormatUnderlined} />
          <MarkButton format="code" icon={FormatQuote} />
          <MarkButton format="link" icon={LinkIcon} />
          <BlockButton format="heading-one" icon={LooksOne} />
          <BlockButton format="heading-two" icon={LooksTwo} />
          <BlockButton format="block-quote" icon={FormatQuote} />
          <BlockButton format="numbered-list" icon={FormatListNumbered} />
          <BlockButton format="bulleted-list" icon={FormatListBulleted} />
          <BlockButton format="left" icon={FormatAlignLeft} />
          <BlockButton format="center" icon={FormatAlignCenter} />
          <BlockButton format="right" icon={FormatAlignRight} />
          <BlockButton format="justify" icon={FormatAlignJustify} />

          <Button>Соханить</Button>
          <br />
        </Toolbar>
        {isLinkActive && (
          <Toolbar>
            <TextField />
          </Toolbar>
        )}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            height: '500px',
            overflowY: 'auto',
            border: '1px white solid',
          }}
        />
      </Slate>
    </Box>
  )
}

function isMarkActive(editor: Editor, format: SlateTextFormat) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

function toggleMark(editor: Editor, format: SlateTextFormat) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

function ActiveButton({
  active,
  children,
  onClick,
  onMouseDown,
  onMouseUp,
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
  onMouseDown?: (event: React.MouseEvent) => void
  onMouseUp?: (event: React.MouseEvent) => void
}) {
  let color = Color.greyLight
  if (active) {
    color = Color.blue
  }

  return (
    <Box
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      sx={{
        padding: '0px',
        backgroundColor: color,
        height: '30px',
        width: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </Box>
  )
}

const MarkButton = ({
  format,
  icon,
}: {
  format: SlateTextFormat
  icon: React.ElementType
}) => {
  const editor = useSlate()
  const IconElement = icon
  return (
    <ActiveButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <IconElement sx={{ width: '20px' }} />
    </ActiveButton>
  )
}

function Element({
  attributes,
  children,
  element,
}: {
  attributes: Record<string, any>
  children: React.ReactNode[]
  element: SlateElement
}) {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

function Leaf({
  attributes,
  children,
  leaf,
}: {
  attributes: Record<string, any>
  children: React.ReactNode
  leaf: Omit<SlateText, 'text'>
}) {
  if (leaf.link) {
    children = <a href={leaf.link}>{children}</a>
  }
  if (leaf.bold) {
    children = <span style={{ fontWeight: 700 }}>{children}</span>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return (
    <span {...attributes} style={{ fontWeight: 400 }}>
      {children}
    </span>
  )
}

type ToolbarProps = {
  children: React.ReactNode
}

function Toolbar({ children }: ToolbarProps) {
  return (
    <Box
      display="flex"
      gap="10px"
      paddingTop="10px"
      paddingLeft="10px"
      style={{ backgroundColor: Color.greyDark }}
    >
      {children}
    </Box>
  )
}

const isBlockActive = (
  editor: Editor,
  format: SlateBlockFormat,
  blockType = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        ElementClass.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const toggleBlock = (editor: Editor, format: SlateBlockFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      ElementClass.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

function BlockButton({
  format,
  icon,
}: {
  format: SlateBlockFormat
  icon: React.ElementType
}) {
  const editor = useSlate()
  const IconElement = icon
  return (
    <ActiveButton
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <IconElement />
    </ActiveButton>
  )
}
