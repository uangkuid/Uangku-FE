/**
 * Prototype data for the wallet screens, taken from the design. There is no API yet: replace this
 * module with real requests once it exists.
 */
import type { Category, Wallet } from '@/data/home'

export interface WalletAccount extends Wallet {
  id: string
  /** Two letters that stand in for a logo. */
  glyph: string
  /** Where the money is held, e.g. "Bank account". */
  kind: string
  family: boolean
  sleeping: boolean
}

export function walletId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function account(
  name: string,
  glyph: string,
  kind: string,
  balance: number,
  flags: { family?: boolean; sleeping?: boolean } = {},
): WalletAccount {
  const { family = false, sleeping = false } = flags
  return { id: walletId(name), name, glyph, kind, balance, family, sleeping }
}

export const walletAccounts: WalletAccount[] = [
  account('Cash', 'CA', 'Cash', 1_250_000),
  account('Orata Family Cash', 'OF', 'Cash', 2_000_000, { family: true }),
  account('Bank Permata', 'BP', 'Bank account', 4_500_000),
  account('Bank BCA', 'BC', 'Bank account', 1_000_000, { family: true }),
  account('Bank Jago', 'BJ', 'Bank account', 500_000),
  account('Dana', 'DA', 'E-wallet', 500_000),
  account('Gopay', 'GP', 'E-wallet', 250_000, { sleeping: true }),
]

export type MemberKey = 'O' | 'A' | 'R'

export interface WalletMember {
  name: string
  email: string
  role: 'Owner' | 'Member' | 'Invited'
  transactions: number
  spent: number
}

export interface WalletTransaction {
  category: Category
  categoryName: string
  notes: string
  amount: number
  date: string
  /** Who recorded it; shown on family wallets. */
  by: MemberKey
}

/** The design draws one wallet's activity; the prototype shows it for every wallet. */
export const walletActivity = {
  income: 1_600_000,
  spending: 1_500_000,
  /** Cumulative totals per day. */
  chart: {
    days: ['22 Jul', '23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', '29 Jul'],
    income: [100_000, 450_000, 700_000, 1_000_000, 1_600_000, 1_600_000, 1_600_000, 1_600_000],
    spending: [100_000, 100_000, 400_000, 650_000, 1_000_000, 1_000_000, 1_300_000, 1_500_000],
    max: 2_000_000,
    ticks: ['2 jt', '1,5 jt', '1 jt', '500 rb', '0'],
    initialDay: 4,
  },
  transactions: [
    {
      category: 'salary',
      categoryName: 'Salary',
      notes: 'Salary',
      amount: 2_500_000,
      date: '1 Jan 25',
      by: 'O',
    },
    {
      category: 'food',
      categoryName: 'Food',
      notes: 'GoFood',
      amount: -50_000,
      date: '1 Jan 25',
      by: 'A',
    },
    {
      category: 'transportation',
      categoryName: 'Transportation',
      notes: 'Go Car',
      amount: -80_000,
      date: '1 Jan 25',
      by: 'O',
    },
    {
      category: 'telecommunication',
      categoryName: 'Telecommunication',
      notes: 'iPhone',
      amount: -10_500_000,
      date: '1 Jan 25',
      by: 'R',
    },
    {
      category: 'salary',
      categoryName: 'Salary',
      notes: 'Salary',
      amount: 52_500_000,
      date: '1 Jan 25',
      by: 'A',
    },
    {
      category: 'bills',
      categoryName: 'Bills',
      notes: 'Electricity',
      amount: -350_000,
      date: '31 Dec 24',
      by: 'O',
    },
  ] satisfies WalletTransaction[],
  members: [
    {
      name: 'Orata',
      email: 'orata@email.com',
      role: 'Owner',
      transactions: 24,
      spent: 2_400_000,
    },
    { name: 'Ayu', email: 'ayu@email.com', role: 'Member', transactions: 17, spent: 1_650_000 },
    { name: 'Raka', email: 'raka@email.com', role: 'Member', transactions: 6, spent: 600_000 },
  ] satisfies WalletMember[],
}

/** Family members who can still be added to a family wallet. */
export const memberCandidates = [
  { email: 'utami@uangku.com', status: 'Admin' },
  { email: 'ahsan@uangku.com', status: 'Member' },
  { email: 'akhan@uangku.com', status: 'Member' },
  { email: 'ikhsan@uangku.com', status: 'Pending' },
]
