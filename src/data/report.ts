/**
 * Prototype data for the report screen, taken from the design. It draws December 2024 only. There
 * is no API yet: replace this module with real requests once it exists.
 */
import type { Category } from '@/data/home'

export type ReportKind = 'expense' | 'income'
export type ReportGroup = 'category' | 'wallet' | 'member'

export interface ReportRow {
  /** Set for category rows. */
  category?: Category
  /** Initials, for wallet and member rows. */
  glyph?: string
  name: string
  percent: number
  amount: number
  /** How the amount moved from the month before; `good` colors it. */
  change?: { text: string; trend: 'good' | 'bad' | 'flat' }
}

function category(
  key: Category,
  name: string,
  percent: number,
  amount: number,
  text: string,
  trend: 'good' | 'bad' | 'flat',
): ReportRow {
  return { category: key, name, percent, amount, change: { text, trend } }
}

function other(glyph: string, name: string, percent: number, amount: number): ReportRow {
  return { glyph, name, percent, amount }
}

export const reportData = {
  month: 'December 2024',
  net: 900_000,
  income: 4_000_000,
  expense: 3_100_000,
  savingsRate: 22.5,
  breakdown: {
    expense: {
      total: 'Rp 3,1 jt',
      category: [
        category('food', 'Food', 40, 1_240_000, '▼ 8%', 'good'),
        category('bills', 'Bills', 20, 620_000, '= same', 'flat'),
        category('transportation', 'Transportation', 15, 465_000, '▼ 22%', 'good'),
        category('shopping', 'Shopping', 13, 403_000, '▲ 35%', 'bad'),
        category('entertainment', 'Entertainment', 12, 372_000, '▼ 10%', 'good'),
      ],
      wallet: [
        other('BP', 'Bank Permata', 35, 1_085_000),
        other('OF', 'Orata Family Cash', 25, 775_000),
        other('BC', 'Bank BCA', 20, 620_000),
        other('CA', 'Cash', 13, 403_000),
        other('DA', 'Dana', 7, 217_000),
      ],
      member: [other('O', 'Orata', 70, 2_170_000), other('N', 'Nadia', 30, 930_000)],
    },
    income: {
      total: 'Rp 4 jt',
      category: [
        category('salary', 'Salary', 63, 2_500_000, '= same', 'flat'),
        category('bonus', 'Bonus', 25, 1_000_000, 'new', 'good'),
        category('other-income', 'Other Income', 12, 500_000, '▼ 29%', 'bad'),
      ],
      wallet: [
        other('BP', 'Bank Permata', 75, 3_000_000),
        other('OF', 'Orata Family Cash', 25, 1_000_000),
      ],
      member: [other('O', 'Orata', 75, 3_000_000), other('N', 'Nadia', 25, 1_000_000)],
    },
  },
  biggest: [
    expense('bills', 'PLN electricity', 'Bills · Bank Permata', 420_000),
    expense('shopping', 'New jacket', 'Shopping · Bank BCA', 289_000, true),
    expense('food', 'Family dinner', 'Food · Orata Family Cash', 265_000, true),
    expense('entertainment', 'Concert ticket', 'Entertainment · Dana', 250_000),
    expense('transportation', 'Train to Bandung', 'Transportation · Bank Jago', 180_000),
  ],
  trend: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [3_200_000, 3_200_000, 3_200_000, 3_500_000, 3_200_000, 4_000_000],
    expense: [2_600_000, 2_400_000, 2_900_000, 2_100_000, 3_400_000, 3_100_000],
    max: 4_500_000,
    ticks: ['4,5 jt', '3 jt', '1,5 jt', '0'],
    badge: 'Dec · +Rp 900rb',
    summary:
      'Six-month trend. Income held between 3.2 and 4 million rupiah. Expense peaked at 3.4 million in November, above income, then fell to 3.1 million in December.',
  },
  compare: [
    { label: 'Total expense', from: 'Rp 3,4 jt', to: 'Rp 3,1 jt', change: '▼ 9%', tone: 'error' },
    { label: 'Total income', from: 'Rp 3,2 jt', to: 'Rp 4 jt', change: '▲ 25%', tone: 'success' },
    {
      label: 'Net cashflow',
      from: '−Rp 200 rb',
      to: '+Rp 900 rb',
      change: 'Back to positive',
      tone: 'primary',
    },
  ] as const,
}

function expense(key: Category, title: string, meta: string, amount: number, family = false) {
  return { category: key, title, meta, amount, family }
}
