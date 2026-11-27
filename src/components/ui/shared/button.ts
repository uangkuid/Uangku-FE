/* Sizes and shapes shared by OraButton and OraIconButton (M3 Expressive). */

export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type ButtonShape = 'round' | 'square'

/*
 * Corner radius per size. A round corner is written as half the height rather than `rounded-full`,
 * so that it can spring to the pressed radius.
 */
const shapeClasses: Record<ButtonSize, Record<ButtonShape | 'pressed', string>> = {
  xs: {
    round: 'rounded-[16px]',
    square: 'rounded-corner-md',
    pressed: 'enabled:active:rounded-corner-sm [a&]:active:rounded-corner-sm',
  },
  s: {
    round: 'rounded-[20px]',
    square: 'rounded-corner-md',
    pressed: 'enabled:active:rounded-corner-sm [a&]:active:rounded-corner-sm',
  },
  m: {
    round: 'rounded-[28px]',
    square: 'rounded-corner-lg',
    pressed: 'enabled:active:rounded-corner-md [a&]:active:rounded-corner-md',
  },
  l: {
    round: 'rounded-[48px]',
    square: 'rounded-corner-xl',
    pressed: 'enabled:active:rounded-corner-lg [a&]:active:rounded-corner-lg',
  },
  xl: {
    round: 'rounded-[68px]',
    square: 'rounded-corner-xl',
    pressed: 'enabled:active:rounded-corner-lg [a&]:active:rounded-corner-lg',
  },
}

/** Resting and pressed shape. A selected toggle swaps between round and square. */
export function buttonShapeClasses(size: ButtonSize, shape: ButtonShape, selected?: boolean) {
  const resting = selected ? (shape === 'round' ? 'square' : 'round') : shape
  return [shapeClasses[size][resting], shapeClasses[size].pressed]
}
