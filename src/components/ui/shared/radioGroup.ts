const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

/**
 * Arrow keys of a `role="radiogroup"` made of `role="radio"` buttons, or of a tab list: they move
 * to the neighbouring option and select it. Pair it with a roving `tabindex` (see `radioTabindex`).
 */
export function onRadioKeydown(event: KeyboardEvent) {
  const step = steps[event.key]
  if (!step) return
  const group = event.currentTarget as HTMLElement
  const radios = [...group.querySelectorAll<HTMLElement>('[role="radio"], [role="tab"]')]
  const index = radios.indexOf(event.target as HTMLElement)
  if (index < 0) return
  event.preventDefault()
  const next = radios[(index + step + radios.length) % radios.length]
  next?.focus()
  next?.click()
}

/** Only one radio is in the tab order: the checked one, or the first while none is. */
export function radioTabindex(values: unknown[], checked: unknown, index: number) {
  const current = values.indexOf(checked)
  return index === Math.max(current, 0) ? 0 : -1
}
