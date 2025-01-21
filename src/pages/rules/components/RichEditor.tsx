import {
  Close,
  DeleteForever,
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
  Looks3,
  LooksOne,
  LooksTwo,
} from '@mui/icons-material'
import { Box, Button, TextField, Tooltip } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Descendant, Editor, Path, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { Color } from 'utils/types'

import { createEditor, Element as ElementClass, Range } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
  useSlateStatic,
  useSelected,
  useFocused,
} from 'slate-react'
import {
  LinkElement,
  SlateBlockFormat,
  SlateElement,
  SlateText,
  SlateTextAlign,
  SlateTextFormat,
} from 'src/types/slate'
import debounce from 'lodash/debounce'
import { createPortal } from 'react-dom'
import { useMutation } from '@tanstack/react-query'
import { updateRules } from 'src/utils/api'

const defaultValue: SlateElement[] = [
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Загрузка правил...' }],
  },
]

type Props = {
  initialValue?: SlateElement[]
  onClose: () => void
}

export function RichEditor({ initialValue, onClose }: Props) {
  const [editor] = useState(() =>
    withLinks(withHistory(withReact(createEditor())))
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const { mutate: saveRules } = useMutation({
    mutationFn: (rules: string) => updateRules(rules),
  })

  const handleSave = () => {
    console.log('saving', JSON.stringify(editor.children))
    saveRules(JSON.stringify(editor.children))
    onClose()
  }

  const handleLinkClick = () => {
    insertLink(editor, 'https://test.com')
  }

  return (
    <Box width="800px" height="600px" border="0px solid white">
      <Box display="flex" marginBottom="10px">
        <Button onClick={onClose} color="customRed">
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          color="customBlue"
          style={{ marginLeft: '20px' }}
        >
          Сохранить
        </Button>
      </Box>
      <Slate editor={editor} initialValue={initialValue ?? defaultValue}>
        <Toolbar>
          <MarkButton format="bold" icon={FormatBold} tooltip="жирный" />
          <MarkButton format="italic" icon={FormatItalic} tooltip="наклон" />
          <MarkButton
            format="underline"
            icon={FormatUnderlined}
            tooltip="подчеркивание"
          />
          {/* <MarkButton format="code" icon={FormatQuote}  /> */}
          <ActiveButton onClick={handleLinkClick} tooltip="вставить ссылку">
            <LinkIcon sx={{ width: '20px' }} />
          </ActiveButton>
          <BlockButton
            format="heading-one"
            icon={LooksOne}
            tooltip="большой заголовок"
          />
          <BlockButton
            format="heading-two"
            icon={LooksTwo}
            tooltip="средний заголовок"
          />
          <BlockButton
            format="heading-three"
            icon={Looks3}
            tooltip="маленький заголовок"
          />
          {/* <BlockButton format="block-quote" icon={FormatQuote} /> */}
          <BlockButton
            format="numbered-list"
            icon={FormatListNumbered}
            tooltip="нумерованный список"
          />
          <BlockButton
            format="bulleted-list"
            icon={FormatListBulleted}
            tooltip="список с точками"
          />
          <BlockButton
            format="left"
            icon={FormatAlignLeft}
            tooltip="выровнять влево"
          />
          <BlockButton
            format="center"
            icon={FormatAlignCenter}
            tooltip="выроврянть по центру"
          />
          <BlockButton
            format="right"
            icon={FormatAlignRight}
            tooltip="выровнять вправо"
          />
          {/* <BlockButton format="justify" icon={FormatAlignJustify} tooltip="" /> */}
        </Toolbar>
        <Editable
          className="editor-container"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            height: '500px',
            overflowY: 'auto',
            border: '1px white solid',
            lineHeight: '1.2',
            position: 'relative',
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
  tooltip,
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
  onMouseDown?: (event: React.MouseEvent) => void
  onMouseUp?: (event: React.MouseEvent) => void
  tooltip?: string
}) {
  let color = Color.greyLight
  if (active) {
    color = Color.blue
  }

  return (
    <Tooltip title={tooltip}>
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
    </Tooltip>
  )
}

const MarkButton = ({
  format,
  icon,
  tooltip,
}: {
  format: SlateTextFormat
  icon: React.ElementType
  tooltip: string
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
      tooltip={tooltip}
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
  const style = { textAlign: element.align ?? 'left' }
  const textStyle = {
    lineHeight: '1.2',
    marginTop: '0.8em',
    marginBottom: '0.8em',
  }
  switch (element.type) {
    case 'link':
      return (
        <Link attributes={attributes} element={element}>
          {children}
        </Link>
      )
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
        <h1 style={{ ...style, ...textStyle }} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={{ ...style, ...textStyle }} {...attributes}>
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3 style={{ ...style, ...textStyle }} {...attributes}>
          {children}
        </h3>
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
        <p
          style={{
            ...style,
            lineHeight: '1.2',
            marginTop: '1em',
            marginBottom: '1em',
          }}
          {...attributes}
        >
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
  leaf: SlateText
}) {
  const style: React.CSSProperties = { fontWeight: '400' }
  if (leaf.bold) {
    style.fontWeight = '700'
  }
  if (leaf.italic) {
    style.fontStyle = 'italic'
  }
  if (leaf.underline) {
    style.textDecoration = 'underline'
  }
  if (leaf.code) {
    style.fontFamily = 'monospace'
  }
  if (leaf.text === '') {
    style.display = 'block'
    style.minHeight = '1em'
  }
  return (
    <span {...attributes} style={style}>
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
  format: SlateBlockFormat | SlateTextAlign,
  blockType: 'align' | 'type' = 'type'
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

const toggleBlock = (
  editor: Editor,
  format: SlateBlockFormat | SlateTextAlign
) => {
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
      align: isActive ? undefined : (format as SlateTextAlign),
    }
  } else {
    newProperties = {
      type: isActive
        ? 'paragraph'
        : isList
          ? 'list-item'
          : (format as SlateBlockFormat),
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format as SlateBlockFormat, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES: (SlateTextAlign | SlateBlockFormat)[] = [
  'left',
  'center',
  'right',
  'justify',
]

function BlockButton({
  format,
  icon,
  tooltip,
}: {
  format: SlateBlockFormat | SlateTextAlign
  icon: React.ElementType
  tooltip: string
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
      tooltip={tooltip}
    >
      <IconElement />
    </ActiveButton>
  )
}

const createLinkNode = (href: string, text: string) =>
  ({
    type: 'link',
    url: href,
    children: [{ text }],
  }) as LinkElement

const removeLink = (editor: Editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) =>
      !Editor.isEditor(n) && ElementClass.isElement(n) && n.type === 'link',
  })
}

const insertLink = (editor: Editor, url: string) => {
  if (!url) return

  const { selection } = editor
  const link = createLinkNode(url, 'New Link')

  ReactEditor.focus(editor)

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      selection.focus?.path
    )

    const parentElement = parentNode as SlateElement

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentElement.type === 'link') {
      removeLink(editor)
    }

    if (editor.isVoid(parentElement)) {
      // Insert the new link after the void node
      Transforms.insertNodes(editor, createParagraphNode([link]), {
        at: Path.next(parentPath),
        select: true,
      })
    } else if (Range.isCollapsed(selection)) {
      // Insert the new link in our last known location
      Transforms.insertNodes(editor, link, { select: true })
    } else {
      // Wrap the currently selected range of text into a Link
      Transforms.wrapNodes(editor, link, { split: true })
      // Remove the highlight and move the cursor to the end of the highlight
      Transforms.collapse(editor, { edge: 'end' })
    }
  } else {
    // Insert the new link node at the bottom of the Editor when selection
    // is falsey
    Transforms.insertNodes(editor, createParagraphNode([link]))
  }
}

const updateLink = (editor: Editor, newUrl: string) => {
  if (!newUrl) return

  const { selection } = editor

  if (!selection) return

  // Find the link node in the current selection
  const [linkNode, linkPath] =
    Editor.above(editor, {
      at: selection,
      match: (n) => ElementClass.isElement(n) && n.type === 'link',
    }) || []

  if (!linkNode) {
    console.warn('No link node found in the current selection.')
    return
  }

  // Update the URL of the existing link
  Transforms.setNodes(editor, { url: newUrl }, { at: linkPath })
}

export const createParagraphNode = (children: SlateElement[]) =>
  ({
    type: 'paragraph',
    children,
  }) as SlateElement

const withLinks = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = (element) =>
    element.type === 'link' ? true : isInline(element)

  return editor
}

type LinkParams = {
  attributes: Record<string, any>
  element: LinkElement
  children: React.ReactNode
}

const Link = ({ attributes, element, children }: LinkParams) => {
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()

  const [linkValue, setLinkValue] = useState(element.url)
  const [popupPosition, setPopupPosition] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0,
  })
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const debounceLink = useCallback(
    debounce((value: string) => {
      updateLink(editor, value)
    }, 300),
    []
  )

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setLinkValue(value)
    debounceLink(value)
  }

  const parentContainer = document.querySelector(
    '.editor-container'
  ) as HTMLElement

  useEffect(() => {
    if (selected && focused && linkRef.current) {
      const linkRect = linkRef.current.getBoundingClientRect()
      const parentContainer = document.querySelector(
        '.editor-container'
      ) as HTMLElement
      const parentRect = parentContainer?.getBoundingClientRect()

      if (parentRect) {
        setPopupPosition({
          top: linkRect.bottom - parentRect.top, // Offset from the parent container
          left: linkRect.left - parentRect.left, // Offset from the parent container
        })
      }
    }
  }, [selected, focused])

  return (
    <span className="element-link">
      <a
        {...attributes}
        href={element.url}
        ref={linkRef}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          color: Color.blueLight,
          textDecoration: 'underline',
          textDecorationColor: Color.blueLight,
        }}
      >
        {children}
      </a>
      {selected &&
        // focused &&
        parentContainer &&
        createPortal(
          <Box
            style={{
              position: 'absolute',

              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: Color.greyLight,
              // zIndex: 100,
            }}
            className="popup"
            contentEditable={false}
          >
            <Box style={{ zIndex: 100, display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                style={{ width: '250px', border: '1px solid white' }}
                value={linkValue}
                onChange={handleLinkChange}
              />
              <Button variant="text" onClick={() => removeLink(editor)}>
                <DeleteForever color="error" />
              </Button>
            </Box>
          </Box>,
          parentContainer
        )}
    </span>
  )
}
