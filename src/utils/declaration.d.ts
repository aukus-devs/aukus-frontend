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
