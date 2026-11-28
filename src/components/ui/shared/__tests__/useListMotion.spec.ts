import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, useTemplateRef } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useListMotion } from '../useListMotion'

const List = defineComponent({
  props: { items: { type: Array<string>, required: true } },
  setup(props) {
    const list = useTemplateRef<HTMLElement>('list')
    useListMotion(
      () => list.value,
      () => props.items,
    )
  },
  template: `
    <ul ref="list">
      <li v-for="item in items" :key="item" :id="item" :data-motion-key="item">{{ item }}</li>
    </ul>
  `,
})

describe('useListMotion', () => {
  let animations: { target: Element; keyframes: Keyframe[]; onfinish?: () => void }[]

  beforeEach(() => {
    animations = []
    Element.prototype.animate = function (this: Element, keyframes) {
      const animation = {
        target: this,
        keyframes: keyframes as Keyframe[],
        cancel: vi.fn<() => void>(),
      }
      animations.push(animation)
      return animation as unknown as Animation
    }
    // Rows 50px high, one under the other.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const rows = this.querySelectorAll('[data-motion-key]').length
      const index = [...(this.parentElement?.querySelectorAll('[data-motion-key]') ?? [])].indexOf(
        this,
      )
      return rows
        ? new DOMRect(0, 0, 300, rows * 50)
        : new DOMRect(0, Math.max(index, 0) * 50, 300, 50)
    })
  })

  afterEach(() => {
    delete (Element.prototype as Partial<Element>).animate
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  function mountList(motion = '500ms linear') {
    const wrapper = mount(List, { props: { items: ['a', 'b', 'c'] }, attachTo: document.body })
    const { style } = wrapper.element as HTMLElement
    style.setProperty('--motion-default-spatial', motion)
    style.setProperty('--motion-default-effects', motion)
    return wrapper
  }

  it('fades a removed item out and slides the rest into its place', async () => {
    const wrapper = mountList()
    await wrapper.setProps({ items: ['b', 'c'] })
    await flushPromises()

    const ghost = wrapper.get('[data-motion-ghost]')
    expect(ghost.text()).toBe('a')
    expect(ghost.attributes()).not.toHaveProperty('id')
    expect(ghost.attributes()).toHaveProperty('inert')

    const moved = animations.filter(({ keyframes }) => 'translate' in keyframes[0]!)
    expect(moved.map(({ target }) => target.id)).toEqual(['b', 'c'])
    expect(moved[0]!.keyframes[0]!.translate).toBe('0px 50px')
    expect(animations.some(({ keyframes }) => keyframes[0]!.height === '150px')).toBe(true)

    animations.find(({ target }) => target === ghost.element)!.onfinish!()
    expect(wrapper.find('[data-motion-ghost]').exists()).toBe(false)
  })

  it('fades a new item in', async () => {
    const wrapper = mountList()
    await wrapper.setProps({ items: ['a', 'b', 'c', 'd'] })
    await flushPromises()

    const entering = animations.filter(({ target }) => target.id === 'd')
    expect(entering.map(({ keyframes }) => keyframes)).toEqual([[{ opacity: 0 }, { opacity: 1 }]])
  })

  it('stays still when motion is reduced', async () => {
    const wrapper = mountList('0s linear')
    await wrapper.setProps({ items: ['c'] })
    await flushPromises()

    expect(animations).toEqual([])
    expect(wrapper.find('[data-motion-ghost]').exists()).toBe(false)
  })
})
