import { describe, it, expect } from 'vitest'

import { samples, strokeOutline } from '../wave'

describe('wave geometry', () => {
  it('samples both ends of a stretch', () => {
    const points = samples(2, 5, (x) => [x, 0])

    expect(points[0]).toEqual([2, 0])
    expect(points[points.length - 1]).toEqual([5, 0])
  })

  it('outlines a stroke on both sides of its line', () => {
    const outline = strokeOutline(
      [
        [0, 5],
        [10, 5],
      ],
      4,
    )

    expect(outline).toBe(
      'M0.00 3.00L10.00 3.00A2 2 0 0 1 10.00 7.00L0.00 7.00A2 2 0 0 1 0.00 3.00Z',
    )
  })
})
