declare module '@mapcar/dice-box'

declare namespace JSX {
  interface IntrinsicElements {
    'snow-effect': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      color?: string
      flakes?: number
      speed?: number
    }
  }
}

// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type SlateText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  align?: 'left' | 'center' | 'right'
  code?: boolean
  link?: string
}

type SlateTextFormat = 'bold' | 'italic' | 'underline' | 'code' | 'link'

type SlateBlockFormat =
  | 'heading-one'
  | 'heading-two'
  | 'block-quote'
  | 'numbered-list'
  | 'bulleted-list'
  | 'left'
  | 'center'
  | 'right'
  | 'justify'

type SlateParagraph = { type: 'paragraph'; children: SlateText[] }
type SlateQuote = { type: 'block-quote'; children: SlateText[] }

type SlateElement = CustomParagraph | CustomQuote

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: SlateElement
    Text: SlateText
  }
}
