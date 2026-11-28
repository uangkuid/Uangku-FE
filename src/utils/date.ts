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

export const FULL_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** Weeks start on Monday. */
export const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const FULL_WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export function toIso(date: Date): IsoDate {
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

/** 0 for Monday to 6 for Sunday. */
function weekday(date: IsoDate) {
  return (toDate(date).getDay() + 6) % 7
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
  return `${WEEKDAY_NAMES[weekday(date)]}, ${formatDayMonth(date)}`
}

/** `2025-01-05` → `5 Jan 25` */
export function formatShortDate(date: IsoDate) {
  return `${formatDayMonth(date)} ${String(dateParts(date).year).slice(2)}`
}

/** `2025-01-05` → `Sunday, 5 Jan 2025` */
export function formatLongDate(date: IsoDate) {
  return `${FULL_WEEKDAY_NAMES[weekday(date)]}, ${formatDayMonth(date)} ${dateParts(date).year}`
}

/** "Today", "Yesterday" or `Saturday, 11 Jan`. */
export function formatRelativeDay(date: IsoDate, today: IsoDate) {
  if (date === today) return 'Today'
  if (date === addDays(today, -1)) return 'Yesterday'
  return `${FULL_WEEKDAY_NAMES[weekday(date)]}, ${formatDayMonth(date)}`
}
