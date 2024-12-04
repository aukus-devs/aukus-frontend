import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useScreenSize from 'src/context/useScreenSize'

type Props = {
  children: React.ReactNode
}

export default function StaticPanel({ children }: Props) {
  const [isFixed, setIsFixed] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const { width } = useScreenSize()

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Empty dependency array ensures the effect runs only on mount and unmount

  const containerRef = useRef<HTMLDivElement>(null)
  const mapBottom = document.getElementById('map-cell-0')

  if (containerRef.current && mapBottom && scrollPosition > 0) {
    const makeFixed =
      window.innerHeight - mapBottom.getBoundingClientRect().bottom < 300

    if (!makeFixed && isFixed) {
      setIsFixed(false)
    }

    if (makeFixed && !isFixed) {
      setIsFixed(true)
    }
  }

  const left = width / 2 - 1300 / 2

  const stopPropogation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Box display={'flex'} justifyContent="center" onClick={stopPropogation}>
      <Box
        minWidth={'1300px'}
        width={'1300px'}
        sx={{
          position: isFixed ? 'fixed' : 'absolute',
          zIndex: 30,
          ...(isFixed ? { bottom: '20px', left } : { marginTop: '-100px' }),
        }}
        ref={containerRef}
      >
        {children}
      </Box>
    </Box>
  )
}
