declare module '@mapcar/dice-box' {
  // Declare the DiceBox class or export as any
  const DiceBox: any // Replace `any` with specific types if known
  export default DiceBox
}

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

declare module 'twallpaper' {
  const twallpaper: any
  export default twallpaper
}
