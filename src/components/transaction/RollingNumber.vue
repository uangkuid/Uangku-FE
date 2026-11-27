<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  /** The formatted number on screen before the roll, e.g. `680.000`. */
  from: string
  /** The formatted number the reels stop on. */
  to: string
}>()

/** The last reel has stopped. */
const emit = defineEmits<{ done: [] }>()

/** The first reel spins this long; each one to its right stops a beat later. */
const FIRST_STOP_MS = 500
const STAGGER_MS = 90

const isDigit = (char: string) => char >= '0' && char <= '9'

interface Reel {
  direction: 'up' | 'down'
  /** Top to bottom. */
  digits: string[]
  /** Where the strip starts and stops, as a share of its height. */
  start: string
  end: string
}

/** A character that holds still, or a reel that turns to it. */
type Column = { char: string; duration?: number } & Partial<Reel>

/**
 * The strip of a reel that turns from one digit to another, a full turn included: upward when the
 * digit grows, downward when it shrinks. A `from` that is no digit starts blank and grows.
 */
function reel(from: string, to: string): Reel {
  const start = isDigit(from) ? Number(from) : 0
  const up = !isDigit(from) || Number(to) > start
  const direction = up ? 1 : -1
  const distance = 10 + (((Number(to) - start) * direction + 10) % 10)
  // From the start to one digit past the target, which shows when the reel overshoots.
  const digits = Array.from({ length: distance + 2 }, (_, step) =>
    String((start + direction * step + 20) % 10),
  )
  if (!isDigit(from)) digits[0] = ''
  // A reel that turns downward reads the same strip from the bottom.
  if (!up) digits.reverse()

  const offset = (index: number) => `${(-100 * index) / digits.length}%`
  return {
    direction: up ? 'up' : 'down',
    digits,
    start: offset(up ? 0 : digits.length - 1),
    end: offset(up ? distance : 1),
  }
}

/** One column per character of `to`. Only the digits that change turn; the others hold still. */
const columns = computed<Column[]>(() => {
  // Align on the right, where the thousands separators line up.
  const before = props.from.padStart(props.to.length)
  let reels = 0

  return [...props.to].map((char, index) => {
    const previous = before[index] ?? ''
    if (!isDigit(char) || char === previous) return { char }
    return { char, ...reel(previous, char), duration: FIRST_STOP_MS + STAGGER_MS * reels++ }
  })
})

let timer: ReturnType<typeof setTimeout>

onMounted(() => {
  const longest = Math.max(0, ...columns.value.map((column) => column.duration ?? 0))
  timer = setTimeout(() => emit('done'), longest)
})
onUnmounted(() => clearTimeout(timer))
</script>

<!--
  A number that arrives like slot machine reels. It is decoration drawn over the real value: the
  caller gives it the type styles, and hides its own text until `done`.
-->
<template>
  <span aria-hidden="true" class="flex h-[1lh] overflow-hidden whitespace-pre motion-reduce:hidden">
    <template v-for="(column, index) in columns" :key="index">
      <span
        v-if="column.digits"
        data-testid="reel"
        :data-direction="column.direction"
        class="h-[1lh] flex-none overflow-hidden [mask-image:linear-gradient(transparent,black_14%,black_86%,transparent)]"
      >
        <span
          class="flex translate-y-(--roll-end) flex-col transition-[translate] ease-[cubic-bezier(0.3,0,0.15,1.08)] starting:translate-y-(--roll-start)"
          :style="{
            '--roll-start': column.start,
            '--roll-end': column.end,
            transitionDuration: `${column.duration}ms`,
          }"
        >
          <span v-for="(digit, step) in column.digits" :key="step" class="h-[1lh]">{{
            digit || ' '
          }}</span>
        </span>
      </span>
      <span v-else class="flex-none">{{ column.char }}</span>
    </template>
  </span>
</template>
