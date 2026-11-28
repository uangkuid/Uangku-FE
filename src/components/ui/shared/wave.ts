/* Geometry of the M3 Expressive wavy progress indicators. */

export type Point = [x: number, y: number]

const pair = ([x, y]: Point) => `${x.toFixed(2)} ${y.toFixed(2)}`

/** An open SVG path through the points. */
export function polyline(points: Point[]) {
  return points.map((point, index) => `${index ? 'L' : 'M'}${pair(point)}`).join('')
}

/**
 * The outline of a stroke of the given width with round caps along the points, as a closed SVG path.
 * It lets `clip-path` cut a wave out of an element, which then takes any background utility.
 */
export function strokeOutline(points: Point[], width: number) {
  const radius = width / 2
  const sides = points.map(([x, y], index) => {
    const [fromX, fromY] = points[index - 1] ?? [x, y]
    const [toX, toY] = points[index + 1] ?? [x, y]
    const length = Math.hypot(toX - fromX, toY - fromY) || 1
    const normalX = ((toY - fromY) / length) * radius
    const normalY = (-(toX - fromX) / length) * radius
    return {
      left: [x + normalX, y + normalY] as Point,
      right: [x - normalX, y - normalY] as Point,
    }
  })
  const first = sides[0]
  const last = sides[sides.length - 1]
  if (!first || !last) return ''
  const cap = `A${radius} ${radius} 0 0 1 `
  const there = polyline(sides.map((side) => side.left))
  const back = sides
    .map((side) => `L${pair(side.right)}`)
    .reverse()
    .slice(1)
    .join('')
  return `${there}${cap}${pair(last.right)}${back}${cap}${pair(first.left)}Z`
}

/** Points about 1px apart from `from` to `to`, both included. */
export function samples(from: number, to: number, point: (at: number) => Point, step = 1) {
  const count = Math.max(Math.ceil((to - from) / step), 1)
  return Array.from({ length: count + 1 }, (_, index) =>
    point(from + ((to - from) * index) / count),
  )
}
