/**
 * Moves focus between the items of a menu or toolbar with the arrow keys, Home and End, wrapping at
 * the ends. Returns whether it handled the key.
 */
export function moveFocus(
  event: KeyboardEvent,
  items: HTMLElement[],
  [back, forward]: [string, string] = ['ArrowUp', 'ArrowDown'],
) {
  const index = items.indexOf(event.target as HTMLElement)
  const targets: Record<string, number> = {
    [back]: index <= 0 ? items.length - 1 : index - 1,
    [forward]: (index + 1) % items.length,
    Home: 0,
    End: items.length - 1,
  }
  const target = targets[event.key]
  if (target === undefined || !items.length) return false
  event.preventDefault()
  items[target]?.focus()
  return true
}
