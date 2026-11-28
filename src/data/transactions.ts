/**
 * Prototype data for the transaction screens, taken from the design. There is no API yet: replace
 * this module with real requests once it exists.
 */
import type { Category, Transaction } from '@/data/home'
import type { IsoDate } from '@/utils/date'

export interface LedgerEntry extends Omit<Transaction, 'date'> {
  id: string
  date: IsoDate
}

function entry(
  id: string,
  day: number,
  category: Category,
  categoryName: string,
  notes: string,
  wallet: string,
  amount: number,
  family = false,
): LedgerEntry {
  const date = `2025-01-${String(day).padStart(2, '0')}`
  return { id, date, category, categoryName, notes, wallet, amount, family }
}

export const ledger: LedgerEntry[] = [
  entry('t1', 1, 'food', 'Food', 'Warteg', 'Cash', -45_000),
  entry('t3a', 3, 'bonus', 'Bonus', 'Year-end bonus', 'Bank Permata', 1_500_000),
  entry('t3b', 3, 'transportation', 'Transportation', 'Grab', 'Cash', -35_000),
  entry('t4', 4, 'food', 'Food', 'Mie Gacoan', 'Cash', -15_000, true),
  entry('t5a', 5, 'salary', 'Salary', 'Salary', 'Cash', 2_500_000, true),
  entry('t5b', 5, 'investment', 'Investment', 'Bitcoin', 'Cash', -2_500_000),
  entry('t5c', 5, 'investment', 'Investment', 'Bitcoin', 'Bank Jago', -2_500_000),
  entry('t6', 6, 'bills', 'Bills', 'Electricity', 'Bank BCA', -350_000, true),
  entry('t7', 7, 'telecommunication', 'Telecommunication', 'Phone credit', 'Dana', -100_000),
  entry('t11a', 11, 'other-income', 'Other Income', 'Freelance fee', 'Bank Permata', 1_000_000),
  entry('t11b', 11, 'shopping', 'Shopping', 'Sneakers', 'Bank Jago', -750_000),
  entry('t26', 26, 'investment', 'Investment', 'Dividend', 'Bank Jago', 250_000),
  entry('t27', 27, 'entertainment', 'Entertainment', 'Movie night', 'Cash', -150_000),
]

/** The categories the filter offers. */
export const filterCategories: { value: Category; label: string }[] = [
  { value: 'salary', label: 'Salary' },
  { value: 'investment', label: 'Investment' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'other-income', label: 'Other Income' },
  { value: 'food', label: 'Food' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
]
