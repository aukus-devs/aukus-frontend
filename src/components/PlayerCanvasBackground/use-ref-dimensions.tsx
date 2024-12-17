import React, { useEffect, useState } from 'react'

const CANVAS_MAX_SIZE = 15000

export function useRefDimensions(
  containerRef: React.RefObject<HTMLDivElement>
) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const getDimensions = () => ({
      width: Math.min(containerRef.current?.offsetWidth ?? 0, CANVAS_MAX_SIZE),
      height: Math.min(
        containerRef.current?.scrollHeight ?? 0,
        CANVAS_MAX_SIZE
      ),
    })

    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (containerRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef])

  return dimensions
}
