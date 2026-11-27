/**
 * Prototype data for the home page, taken from the design. There is no API yet: replace this
 * module with real requests once it exists.
 */

export type Category =
  | 'salary'
  | 'investment'
  | 'bonus'
  | 'other-income'
  | 'food'
  | 'transportation'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'others'
  | 'telecommunication'
  | 'meals'
  | 'clothes'
  | 'beauty'
  | 'vacation'
  | 'pet'
  | 'sport'
  | 'technology'
  | 'insurance'
  | 'donation'

export interface Wallet {
  name: string
  balance: number
  family?: boolean
}

export interface Transaction {
  category: Category
  categoryName: string
  notes: string
  date: string
  wallet: string
  family?: boolean
  /** Positive for income, negative for spending. */
  amount: number
}

export interface SpendingCategory {
  category: Category
  name: string
  amount: number
  /** Share of this month's spending, 0–100. */
  percent: number
}

export const homeData = {
  user: { name: 'Orata', family: 'Orata Family', initials: 'UK' },
  today: 'Sunday, 5 January 2025',
  greeting: 'Good evening',
  totalBalance: 10_000_000,
  monthlyChange: 3_000_000,
  walletCount: 7,
  wallets: [
    { name: 'Cash', balance: 1_250_000 },
    { name: 'Orata Family Cash', balance: 2_000_000, family: true },
    { name: 'Bank Permata', balance: 4_500_000 },
  ] satisfies Wallet[],
  month: {
    name: 'January',
    income: 3_500_000,
    spending: 500_000,
    /** As drawn in the design; it does not equal spending / income. */
    spentPercent: 12.5,
  },
  transactions: [
    {
      category: 'investment',
      categoryName: 'Investment',
      notes: 'Bitcoin',
      date: '5 Jan',
      wallet: 'Bank Jago',
      amount: -460_000,
    },
    {
      category: 'other-income',
      categoryName: 'Other Income',
      notes: 'Freelance fee',
      date: '4 Jan',
      wallet: 'Bank Permata',
      amount: 1_000_000,
    },
    {
      category: 'transportation',
      categoryName: 'Transportation',
      notes: 'Grab',
      date: '3 Jan',
      wallet: 'Cash',
      amount: -35_000,
    },
    {
      category: 'food',
      categoryName: 'Food',
      notes: 'Indomie',
      date: '3 Jan',
      wallet: 'Cash',
      amount: -5_000,
    },
    {
      category: 'salary',
      categoryName: 'Salary',
      notes: 'January salary',
      date: '1 Jan',
      wallet: 'Orata Family Cash',
      family: true,
      amount: 2_500_000,
    },
  ] satisfies Transaction[],
  topSpending: [
    { category: 'investment', name: 'Investment', amount: 460_000, percent: 92 },
    { category: 'transportation', name: 'Transportation', amount: 35_000, percent: 7 },
    { category: 'food', name: 'Food', amount: 5_000, percent: 1 },
  ] satisfies SpendingCategory[],
}
