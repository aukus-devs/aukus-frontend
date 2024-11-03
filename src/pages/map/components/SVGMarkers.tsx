export default function SVGMarkers() {

  const baseColor = 'rgba(0,0,0,0.2)'
  const greenColor = 'rgba(0,255,0,0.5)'
  const redColor = 'rgba(255,0,0,0.5)'

  const arrowPoints = '0 0, 6 2, 0 4'

  return (
    <svg style={{ height: 0, display: 'block' }}>
      <defs>
        <marker
          id="green-arrow-start"
          markerWidth="6"
          markerHeight="4"
          refX="-10"
          refY="2"
          orient="auto"
          stroke={baseColor}
          strokeWidth={1}
        >
          <polygon points={arrowPoints} fill={greenColor} />
        </marker>
        <marker
          id="green-arrow-end"
          markerWidth="6"
          markerHeight="4"
          refX="0"
          refY="2"
          orient="auto"
          stroke={baseColor}
          strokeWidth={1}
        >
          <polygon points={arrowPoints} fill={greenColor} />
        </marker>
        <marker
          id="red-arrow-start"
          markerWidth="6"
          markerHeight="4"
          refX="-10"
          refY="2"
          orient="auto"
          stroke={baseColor}
          strokeWidth={1}
        >
          <polygon points={arrowPoints} fill={redColor} />
        </marker>
        <marker
          id="red-arrow-end"
          markerWidth="6"
          markerHeight="4"
          refX="0"
          refY="2"
          orient="auto"
          stroke={baseColor}
          strokeWidth={1}
        >
          <polygon points={arrowPoints} fill={redColor} />
        </marker>
      </defs>
    </svg>
  )
}
