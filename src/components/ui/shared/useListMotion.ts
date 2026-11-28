import { nextTick, watch, type WatchSource } from 'vue'

/** An item as it was on screen, measured from the top left corner of the list. */
interface Snapshot {
  element: HTMLElement
  /** The key of the item it sits inside, if any. */
  parent?: string
  left: number
  top: number
  width: number
  height: number
  opacity: number
}

const ITEM = '[data-motion-key]'

/** Reads a motion token, `<duration> <easing>`. */
function readSpring(element: Element, token: string) {
  const value = getComputedStyle(element).getPropertyValue(token).trim()
  const [, amount, unit, easing] = /^([\d.]+)(ms|s)\s+(.+)$/.exec(value) ?? []
  return { duration: Number(amount ?? 0) * (unit === 's' ? 1000 : 1), easing: easing ?? 'linear' }
}

function measure(root: HTMLElement) {
  const origin = root.getBoundingClientRect()
  const items = new Map<string, Snapshot>()
  for (const element of root.querySelectorAll<HTMLElement>(ITEM)) {
    const { left, top, width, height } = element.getBoundingClientRect()
    const opacity = getComputedStyle(element).opacity
    items.set(element.dataset.motionKey!, {
      element,
      parent: element.parentElement?.closest<HTMLElement>(ITEM)?.dataset.motionKey,
      left: left - origin.left,
      top: top - origin.top,
      width,
      height,
      opacity: opacity ? Number(opacity) : 1,
    })
  }
  return { items, height: origin.height }
}

/** A lifeless copy of a removed item, left where it was so that it can fade away. */
function ghostOf({ element, left, top, width, height }: Snapshot) {
  const ghost = element.cloneNode(true) as HTMLElement
  for (const node of [ghost, ...ghost.querySelectorAll('*')]) {
    node.removeAttribute('id')
    node.removeAttribute('data-motion-key')
  }
  ghost.setAttribute('inert', '')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.setAttribute('data-motion-ghost', '')
  Object.assign(ghost.style, {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    margin: '0',
  })
  return ghost
}

/**
 * Animates a list as its content changes, in the manner of Android's `RecyclerView`: items that
 * leave fade out, those that stay slide to their new places, and new ones fade in, while the list
 * grows or shrinks to fit.
 *
 * Give each item a `data-motion-key` that is unique within the list; items may nest. The list
 * element must be positioned (`relative`). `source` must change whenever the items do.
 */
export function useListMotion(root: () => HTMLElement | null, source: WatchSource) {
  /** The animations that displace things, which must end before positions are measured again. */
  let moving: Animation[] = []

  // Runs before the DOM is patched, so the first measure sees the old list.
  watch(source, async () => {
    const list = root()
    if (!list || typeof list.animate !== 'function') return
    const spatial = readSpring(list, '--motion-default-spatial')
    const fade = readSpring(list, '--motion-default-effects')
    // Reduced motion makes the tokens instant.
    if (!spatial.duration) return

    const before = measure(list)
    await nextTick()
    if (!list.isConnected) return
    for (const animation of moving) animation.cancel()
    moving = []
    const after = measure(list)

    // Only the outermost of nested items that come or go needs animating.
    const removed = [...before.items].filter(
      ([key, item]) => !after.items.has(key) && (!item.parent || after.items.has(item.parent)),
    )
    const added = [...after.items].filter(
      ([key, item]) => !before.items.has(key) && (!item.parent || before.items.has(item.parent)),
    )
    // As `RecyclerView` does, clear the removed items first, then close the gaps.
    const moveDelay = removed.length ? fade.duration : 0
    const timing: KeyframeAnimationOptions = { ...spatial, delay: moveDelay, fill: 'backwards' }
    let moved = false

    for (const [, item] of removed) {
      const ghost = ghostOf(item)
      // First among its siblings, so that the items sliding over it are drawn on top.
      list.prepend(ghost)
      const animation = ghost.animate([{ opacity: item.opacity }, { opacity: 0 }], {
        ...fade,
        fill: 'forwards',
      })
      animation.onfinish = () => ghost.remove()
    }

    for (const [key, item] of after.items) {
      const old = before.items.get(key)
      if (!old) continue
      // Measured within the enclosing item, whose own movement carries this one along.
      const oldParent = old.parent ? before.items.get(old.parent) : undefined
      const newParent = item.parent ? after.items.get(item.parent) : undefined
      const x = old.left - (oldParent?.left ?? 0) - (item.left - (newParent?.left ?? 0))
      const y = old.top - (oldParent?.top ?? 0) - (item.top - (newParent?.top ?? 0))
      if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) continue
      moved = true
      moving.push(
        item.element.animate([{ translate: `${x}px ${y}px` }, { translate: '0 0' }], timing),
      )
    }

    if (Math.abs(before.height - after.height) >= 0.5) {
      moved = true
      moving.push(
        list.animate(
          [
            { height: `${before.height}px`, overflow: 'clip' },
            { height: `${after.height}px`, overflow: 'clip' },
          ],
          timing,
        ),
      )
    }

    // New items wait for the others to make room.
    const addDelay = moveDelay + (moved ? fade.duration : 0)
    for (const [, item] of added) {
      item.element.animate([{ opacity: 0 }, { opacity: 1 }], {
        ...fade,
        delay: addDelay,
        fill: 'backwards',
      })
    }
  })
}
