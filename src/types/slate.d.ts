// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export type SlateText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
  link?: string
}

export type SlateTextFormat = 'bold' | 'italic' | 'underline' | 'code' | 'link'

export type SlateTextAlign = 'left' | 'center' | 'right' | 'justify'

export type SlateBlockFormat =
  | 'heading-one'
  | 'heading-two'
  | 'block-quote'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item'
  | 'paragraph'

export type SlateElement = {
  type: SlateBlockFormat
  children: SlateText[]
  align?: SlateTextAlign
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: SlateElement
    Text: SlateText
  }
}
