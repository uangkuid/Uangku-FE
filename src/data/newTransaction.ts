/**
 * Prototype data for the new transaction form, taken from the design. There is no API yet: replace
 * this module with real requests once it exists.
 */
import type { Category, Wallet } from '@/data/home'
import type { IsoDate } from '@/utils/date'

export type TransactionType = 'expense' | 'income' | 'transfer'

export interface CategoryOption {
  category: Category
  name: string
  subcategories?: string[]
}

/** Which kinds of transactions a day already has. */
export interface DayActivity {
  income: boolean
  expense: boolean
}

const today: IsoDate = '2025-01-05'

/** January 2025 as drawn in the design: `i` is income, `o` is expense. */
const january: Record<number, string> = {
  1: 'o',
  2: 'o',
  3: 'io',
  4: 'o',
  5: 'io',
  6: 'o',
  7: 'o',
  11: 'io',
  26: 'i',
  27: 'o',
}

/** The design's stand-in activity: January 2025 is fixed, earlier months are generated. */
function activityOn(date: IsoDate): DayActivity {
  const [year = 0, month = 0, day = 0] = date.split('-').map(Number)
  let marks = ''
  if (date.startsWith('2025-01')) {
    marks = january[day] ?? ''
  } else if (date < today) {
    const hash = ((year * 372 + (month - 1) * 31 + day) * 2654435761) % 97
    if (day === 1 || day === 25) marks = hash % 2 ? 'io' : 'i'
    else if (hash % 3 === 0) marks = 'o'
    else if (hash % 11 === 0) marks = 'io'
  }
  return { income: marks.includes('i'), expense: marks.includes('o') }
}

export const newTransactionData = {
  today,
  years: [2023, 2024, 2025, 2026],
  activityOn,
  quickAmounts: [
    { label: '+10rb', value: 10_000 },
    { label: '+50rb', value: 50_000 },
    { label: '+100rb', value: 100_000 },
    { label: '+500rb', value: 500_000 },
  ],
  wallets: [
    { name: 'Cash' },
    { name: 'Bank Permata' },
    { name: 'Orata Family Cash', family: true },
    { name: 'Bank BCA', family: true },
    { name: 'Bank Jago' },
    { name: 'Dana' },
  ] satisfies Pick<Wallet, 'name' | 'family'>[],
  defaultWallet: 'Cash',
  defaultTransfer: { from: 'Bank Permata', to: 'Cash' },
  /** The category grid shows the first few of each list; "More" opens all of them. */
  categories: {
    expense: [
      { category: 'food', name: 'Food', subcategories: ['Groceries', 'Restaurant', 'Coffee'] },
      {
        category: 'transportation',
        name: 'Transport',
        subcategories: ['Fuel', 'Parking', 'Ride-hailing'],
      },
      { category: 'shopping', name: 'Shopping' },
      { category: 'bills', name: 'Bills', subcategories: ['Electricity', 'Internet', 'Water'] },
      { category: 'entertainment', name: 'Fun' },
      { category: 'health', name: 'Health' },
      { category: 'education', name: 'Education' },
      { category: 'others', name: 'Others' },
      { category: 'telecommunication', name: 'Phone & data' },
      { category: 'meals', name: 'Meals' },
      { category: 'clothes', name: 'Clothes' },
      { category: 'beauty', name: 'Beauty' },
      { category: 'vacation', name: 'Vacation' },
      { category: 'pet', name: 'Pet' },
      { category: 'sport', name: 'Sport' },
      { category: 'technology', name: 'Technology' },
      { category: 'insurance', name: 'Insurance' },
      { category: 'donation', name: 'Donation' },
    ],
    income: [
      {
        category: 'salary',
        name: 'Salary',
        subcategories: ['Company A', 'Company B', 'Company C'],
      },
      { category: 'investment', name: 'Investment' },
      { category: 'bonus', name: 'Bonus' },
      { category: 'other-income', name: 'Other Income' },
      { category: 'beauty', name: 'Beauty' },
    ],
  } satisfies Record<Exclude<TransactionType, 'transfer'>, CategoryOption[]>,
  /** How many categories the grid shows. */
  gridSize: { expense: 8, income: 4 },
}
