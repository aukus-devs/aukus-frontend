// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export type SlateText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

export type SlateTextFormat = 'bold' | 'italic' | 'underline' | 'code'
export type SlateTextAlign = 'left' | 'center' | 'right' | 'justify'

export type SlateBlockFormat =
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'block-quote'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item'
  | 'paragraph'

type BlockElement = {
  type: SlateBlockFormat
  children: (SlateText | SlateElement)[]
  align?: SlateTextAlign
}

export type LinkElement = {
  type: 'link'
  url: string
  children: SlateText[]
  align?: SlateTextAlign
}

export type SlateElement = BlockElement | LinkElement

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: SlateElement
    Text: SlateText
  }
}
