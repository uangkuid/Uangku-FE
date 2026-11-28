import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import OraLoadingIndicator from '../OraLoadingIndicator.vue'
import { loadingShapes } from '../shapes'

describe('OraLoadingIndicator', () => {
  it('is a named, indeterminate progress bar', () => {
    const indicator = mount(OraLoadingIndicator, { props: { label: 'Loading' } })

    expect(indicator.attributes('role')).toBe('progressbar')
    expect(indicator.attributes('aria-label')).toBe('Loading')
    expect(indicator.attributes('aria-valuenow')).toBeUndefined()
  })

  it('draws shapes that can morph into one another', () => {
    const commands = loadingShapes.map((path) => path.replace(/[^A-Z]/g, ''))

    expect(new Set(commands).size).toBe(1)
  })
})
