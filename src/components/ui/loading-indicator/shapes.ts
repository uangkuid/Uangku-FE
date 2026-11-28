/*
 * The shapes the M3 Expressive loading indicator morphs between. Each is drawn from the same number
 * of points, so that SVG can interpolate one path into the next. They fit a 38 by 38 box centered on
 * the origin.
 */

const POINTS = 120

/** A path from the distance to the center at each angle. */
function shape(radius: (angle: number) => number) {
  const points = Array.from({ length: POINTS }, (_, index) => {
    const angle = (index / POINTS) * 2 * Math.PI
    const r = radius(angle)
    return `${(r * Math.cos(angle)).toFixed(2)} ${(r * Math.sin(angle)).toFixed(2)}`
  })
  return `M${points.join('L')}Z`
}

/** A circle with `lobes` bumps of the given depth. */
const lobed = (lobes: number, depth: number) =>
  shape((angle) => 19 * (1 - depth + depth * Math.cos(lobes * angle)))

/** A superellipse: from an oval toward a pill. */
const oval = (width: number, height: number, power: number) =>
  shape(
    (angle) =>
      (Math.abs(Math.cos(angle) / width) ** power + Math.abs(Math.sin(angle) / height) ** power) **
      (-1 / power),
  )

export const loadingShapes = [
  lobed(10, 0.1), // soft burst
  lobed(9, 0.06), // nine-sided cookie
  lobed(5, 0.07), // pentagon
  oval(19, 11, 3), // pill
  lobed(8, 0.09), // sunny
  lobed(4, 0.13), // four-sided cookie
  oval(19, 13, 2), // oval
]
