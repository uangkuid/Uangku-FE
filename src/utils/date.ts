/* Calendar helpers. Dates are `YYYY-MM-DD` strings in local time, so they compare as text. */

export type IsoDate = string

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Weeks start on Monday. */
export const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toIso(date: Date): IsoDate {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function dateParts(date: IsoDate) {
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number)
  /** `month` is 0-based, as in `Date`. */
  return { year, month: month - 1, day }
}

function toDate(date: IsoDate) {
  const { year, month, day } = dateParts(date)
  return new Date(year, month, day)
}

export function addDays(date: IsoDate, days: number) {
  const result = toDate(date)
  result.setDate(result.getDate() + days)
  return toIso(result)
}

/** The same day in another month, or the last day of a month that is too short. */
export function withMonth(date: IsoDate, year: number, month: number) {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return toIso(new Date(year, month, Math.min(dateParts(date).day, lastDay)))
}

/** The weeks that cover a month, padded with the neighbouring months' days. */
export function monthWeeks(year: number, month: number) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: Math.ceil((lead + days) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = new Date(year, month, week * 7 + weekday - lead + 1)
      return { date: toIso(date), day: date.getDate(), inMonth: date.getMonth() === month }
    }),
  )
}

/** `2025-01-05` → `5 Jan` */
export function formatDayMonth(date: IsoDate) {
  const { day, month } = dateParts(date)
  return `${day} ${MONTH_NAMES[month]}`
}

/** `2025-01-05` → `Sun, 5 Jan` */
export function formatWeekday(date: IsoDate) {
  return `${WEEKDAY_NAMES[(toDate(date).getDay() + 6) % 7]}, ${formatDayMonth(date)}`
}
